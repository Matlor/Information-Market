import InvoiceTypes "../invoice/Types";
import GraphQL      "../graphql/graphqlTypes";
import Types        "types";

import Utils        "utils";
import Text         "mo:base/Text";
import Int          "mo:base/Int";
import Int32        "mo:base/Int32";
import Iter         "mo:base/Iter";
import Nat          "mo:base/Nat";
import Nat32        "mo:base/Nat32";
import Nat64        "mo:base/Nat64";
import Principal    "mo:base/Principal";
import Result       "mo:base/Result";
import Time         "mo:base/Time";
import Trie         "mo:base/Trie";
import Error        "mo:base/Error";
import Bool         "mo:base/Bool";
import Debug        "mo:base/Debug";
import Option       "mo:base/Option";
import Stack        "mo:base/Stack";
import Array        "mo:base/Array";

shared({ caller = initializer }) actor class Market(arguments: Types.InstallMarketArguments) = this {

    // ------------------------- Configutations -------------------------
    
    // Principals
    stable let invoice_principal: Principal = arguments.invoice_canister;
    stable let graphql_principal: Principal = arguments.graphql_canister;

    // Actors
    private let invoice_canister_ : InvoiceTypes.Interface = actor (Principal.toText(invoice_principal));
    private let graphql_canister_ : GraphQL.Interface = actor (Principal.toText(graphql_principal));

    // Settings
    private stable var coin_symbol_ : Text = arguments.coin_symbol;
    private stable var min_reward_ : Nat = arguments.min_reward_e8s;
    private stable var fee_ : Nat = arguments.transfer_fee_e8s;
    private stable var duration_pick_answer_ : Int32 = Int32.fromInt(arguments.pick_answer_duration_minutes);
    private stable var duration_disputable_ : Int32 = Int32.fromInt(arguments.disputable_duration_minutes);
    private stable var update_status_on_heartbeat_: Bool = arguments.update_status_on_heartbeat;

    public shared func get_coin_symbol() : async Text {
        return coin_symbol_;
    };

    public shared func get_min_reward() : async Nat {
        return min_reward_;
    };

    public shared func get_fee() : async Nat {
        return fee_;
    };

    public shared func get_duration_pick_answer() : async Int32 {
        return duration_pick_answer_;
    };

    public shared func get_duration_disputable() : async Int32 {
        return duration_disputable_;
    };

    public shared func get_update_status_on_heartbeat() : async Bool {
        return update_status_on_heartbeat_;
    };

    // ------------------------- Update market params -------------------------

    public shared({caller}) func update_market_params(params: Types.UpdateMarketParams) : async Result.Result<(), Types.Error>{
        if (caller != initializer){
            return #err(#NotAllowed);
        };
        min_reward_ := Option.get(params.min_reward_e8s, min_reward_);
        fee_ := Option.get(params.transfer_fee_e8s, fee_);
        duration_pick_answer_ := Option.get(params.pick_answer_duration_minutes, duration_pick_answer_);
        duration_disputable_ := Option.get(params.disputable_duration_minutes, duration_disputable_);
        #ok;
    };

    type PayoutRecord = {
        reward: Int32;
        to: Principal;
        status: PayoutStatus;
    };

    type PayoutStatus = {
        #PENDING;
        #ONGOING;
        #DONE: Nat64; // Block height
    };

    var payouts_ = Trie.empty<Text, PayoutRecord>();

    // ------------------------- User Management -------------------------
    // TO DO: does this function need blockers as well to not be called several times?
    public shared ({caller}) func create_user(name: Text) : async Result.Result<GraphQL.UserType, Types.Error> {
        if ((await graphql_canister_.get_user(Principal.toText(caller))) != null) {
            return #err(#UserExists);
        };
        Result.fromOption(
            await graphql_canister_.create_user(Principal.toText(caller), name, Utils.time_minutes_now()),
            #GraphQLError);
    };

    // TO DO: does this function need blockers as well to not be called several times?
    public shared ({caller}) func update_user(name: Text, avatar: ?Text) : async Result.Result<GraphQL.UserType, Types.Error> {
        var result = Result.fromOption<GraphQL.UserType, Types.Error>(await graphql_canister_.get_user(Principal.toText(caller)), #UserNotFound);
        await iterate<GraphQL.UserType, Types.Error>(result, func(user: GraphQL.UserType) : async() {
            result := Result.fromOption(await graphql_canister_.update_user(Principal.toText(caller), name, avatar), #GraphQLError);
        });
        result;
    };

    func iterate<Ok, Err>(res: Result.Result<Ok, Err>, f : Ok -> async()) : async() {
        switch(res){
            case(#ok(ok)) { await f(ok);};
            case(#err(_)) {};
        };
    };

    // ------------------------- Create Invoice -------------------------
    // TO DO: does this function need blockers as well to not be called several times?
    public shared ({caller}) func create_invoice(reward: Nat) : async InvoiceTypes.CreateInvoiceResult  {
        if(reward < min_reward_) {
            return #err({ kind = #Other; message = ?"Set reward is below minimum";});
        };
        switch (await graphql_canister_.get_user(Principal.toText(caller))){
            case(null){
                return #err({ kind = #Other; message = ?"Unknown user";});
            };
            case(?user){
                // rounding up as graphql is using e3s
                // the difference is low enough to be irrelevant for the user
                switch (await invoice_canister_.create_invoice({
                    amount = Utils.round_up_to_e3s(reward) + fee_;
                    details = null;
                    permissions = null;
                    token = { symbol = coin_symbol_; };
                })){
                    case (#err create_invoice_err) {
                        return #err(create_invoice_err);
                    };
                    case (#ok create_invoice_success) {
                        switch (await graphql_canister_.create_invoice(
                            Nat.toText(create_invoice_success.invoice.id),
                            user.id
                        )){
                            case (null) {
                                return #err({ kind = #Other; message = ?"GraphQL error";});
                            };
                            case (?invoice) {
                                return #ok(create_invoice_success);
                            };
                        };
                    };
                };
            };
        };
    };

    // ------------------------- Ask Question -------------------------
    // TO DO: does this function need to store paid invoices locally as well?
    // TO DO: does this function need blockers as well to not be called several times?
    public shared ({caller}) func ask_question (
        invoice_id: Nat,
        duration_minutes: Nat,
        title: Text,
        content: Text
    ) : async Result.Result<GraphQL.QuestionType, Types.Error> {
        let author = Principal.toText(caller);
        // Verify that the invoice exists in database
        var result = Result.fromOption<GraphQL.UserType, Types.Error>(await graphql_canister_.get_user(Principal.toText(caller)), #UserNotFound);
        switch (await graphql_canister_.get_invoice(Nat.toText(invoice_id))){
            case (null) {
                return #err(#NotFound);
            };
            case (?graphql_invoice) {
                // Verify the buyer of the invoice is the caller that is opening up the question
                // This also ensures that there is a user associated to the caller
                if (graphql_invoice.buyer.id != author) {
                    return #err(#NotAllowed);
                } else {
                    // Verify the invoice has been paid
                    switch (await invoice_canister_.verify_invoice({id = invoice_id})) {
                         case(#err err) {  
                            return #err(#VerifyInvoiceError);
                        };
                        case(#ok verify_invoice_success){
                            var invoice_amount : Nat = 0;
                            switch(verify_invoice_success){
                                case(#AlreadyVerified verified){
                                    // If it has already been verified, check that no
                                    // question already exists for this invoice
                                    switch(await graphql_canister_.get_question_by_invoice(Nat.toText(invoice_id))){
                                        case(?question){
                                            return #err(#NotAllowed);
                                        };
                                        case(null){
                                            invoice_amount := verified.invoice.amount;
                                        };
                                    };
                                };
                                case(#Paid paid){
                                    invoice_amount := paid.invoice.amount;
                                };
                            };
                            // Finally create the question
                            let now = Utils.time_minutes_now();
                            switch (await graphql_canister_.create_question(
                                author,
                                Nat.toText(invoice_id),
                                now,
                                now + Int32.fromInt(duration_minutes),
                                Int32.fromInt(duration_minutes),
                                title,
                                content,
                                Utils.e8s_to_e3s(invoice_amount - fee_)
                            )){
                                case(null) {
                                    return #err(#GraphQLError);
                                };
                                case (?question) {
                                    return #ok(question);
                                };
                            };
                        };
                    };
                };
            };
        };
    };
    
    // ------------------------- Answer Question -------------------------
    // TO DO: does this function need blockers as well to not be called several times?
    public shared ({caller}) func answer_question(
        question_id: Text,
        content: Text
    ): async Result.Result<GraphQL.AnswerType, Types.Error> {
        // Check the user is registred
        switch (await graphql_canister_.get_user(Principal.toText(caller))){
            case(null){
                return #err(#UserNotFound);
            };
            case(?user){
                // Check the question exists
                switch(await graphql_canister_.get_question(question_id)){
                    case(null){
                        return #err(#NotFound);
                    };
                    case(?question){
                        // Verify one does not attempt to answer its own question
                        if (question.author.id == user.id) {
                            return #err(#NotAllowed);
                        // Verify the question is open
                        } else if (question.status != #OPEN) {
                            return #err(#WrongStatus);
                        } else {
                            switch(await graphql_canister_.create_answer(
                                question_id,
                                user.id,
                                Utils.time_minutes_now(),
                                content
                            )){
                                case(null){
                                    return #err(#GraphQLError);
                                };
                                case(?answer){
                                    return #ok(answer);
                                };
                            };
                        };
                    };
                };
            };
        };
    };

    // ------------------------- Pick Winner -------------------------
    // TO DO: does this function need blockers as well to not be called several times?
    // TO DO: (optimisation) ideally one could have spare the call to GraphQL.get_question if a variable
    // question: QuestionType is added to the AnswerType inside the graphql.rs canister
    public shared ({caller}) func pick_winner(
        question_id: Text,
        answer_id: Text
        ) : async Result.Result<(), Types.Error> {
        switch(await graphql_canister_.get_question(question_id)){
             case(null){
                return #err(#NotFound);
            };
            case(?question){
                let now = Utils.time_minutes_now();
                if (question.author.id != Principal.toText(caller)) {
                    return #err(#NotAllowed);
                } else if (question.status != #PICKANSWER) {
                    return #err(#WrongStatus);
                } else if ((await graphql_canister_.get_answer(question_id, answer_id)) == null) {
                    return #err(#NotFound);
                } else if (not (await graphql_canister_.pick_winner(question_id, answer_id, now, now + duration_disputable_))){
                    return #err(#GraphQLError);
                } else {
                    return #ok();
                };
            };
        };
    };

    // ------------------------- Trigger Dispute -------------------------
    // TO DO: does this function need blockers as well to not be called several times?
    // TO DO: opening a dispute shall cost a fee. This fee shall reward the arbitrator.
    public shared ({caller}) func trigger_dispute(
        question_id: Text
    ): async Result.Result<(), Types.Error> {
        switch(await graphql_canister_.get_question(question_id)){
             case(null){
                return #err(#NotFound);
            };
            case(?question){
                let now = Utils.time_minutes_now();
                if (question.status != #DISPUTABLE) {
                    return #err(#WrongStatus);
                } else if (not(await graphql_canister_.has_answered(question_id, Principal.toText(caller)))) {
                    return #err(#NotAllowed);
                } else if (not (await graphql_canister_.open_dispute(question_id, now))){
                    return #err(#GraphQLError);
                } else {
                    return #ok();
                };
            };
        };
    };

    // ------------------------- Arbitrate -------------------------
    // Centralised version: the contract deployer is the arbitrator
    // TO DO: the case is not handled that the arbitrator never does it's job.
    // TO DO: does this function need blockers as well to not be called several times?
    public shared ({caller}) func arbitrate(
        question_id: Text,
        answer_id: Text
    ): async Result.Result<(), Types.Error> {
        if (caller != initializer){
            return #err(#NotAllowed);
        };
        switch(await graphql_canister_.get_question(question_id)){
             case(null){
                return #err(#NotFound);
            };
            case(?question){
                if (question.status != #DISPUTED) {
                    return #err(#WrongStatus);
                } else switch (await graphql_canister_.get_answer(question_id, answer_id)) {
                    case(null) { return #err(#NotFound) };
                    case(?answer) {
                        if ((await graphql_canister_.solve_dispute(question_id, answer_id, Utils.time_minutes_now())) == false){
                            Debug.print("Arbitration: Could not solve_dispute for the question with id: \"" # question.id # "\"");
                            return #err(#GraphQLError);
                        } else {
                            let payout : PayoutRecord = { reward = question.reward; to = Principal.fromText(answer.author.id); status = #PENDING };
                            payouts_ := Trie.put(payouts_, {key = question_id; hash = Text.hash(question_id)}, Text.equal, payout).0;
                            return #ok();
                        };
                    };
                };
            };
        };
    };

    // ------------------------- Update status -------------------------

    var load_questions_ = false;
    let stack_questions_ = Stack.Stack<GraphQL.QuestionType>();

    // TODO: Should only iterate over question that are not CLOSED
    public func update_status() : async () {
        
        if (stack_questions_.isEmpty() and not load_questions_){
            load_questions_ := true;
            let questions = await graphql_canister_.get_questions();
            for (question in Array.vals(questions)){
                stack_questions_.push(question)
            };
            load_questions_ := false;
        };

        let now = Utils.time_minutes_now();

        loop switch(stack_questions_.pop()){
            case(null) { return; };
            case(?question){
                if (now >= question.status_end_date) {
                    switch(question.status){
                        case(#OPEN){
                            if (await graphql_canister_.has_answers(question.id)){
                                // Update the question's state, the author must pick an answer
                                ignore await graphql_canister_.must_pick_answer(question.id, now, now + duration_pick_answer_);
                            } else if(await graphql_canister_.close_question(question.id, now)){
                                let payout : PayoutRecord = { reward = question.reward; to = Principal.fromText(question.author.id); status = #PENDING };
                                payouts_ := Trie.put(payouts_, {key = question.id; hash = Text.hash(question.id)}, Text.equal, payout).0;
                            } else {
                                Debug.print("Update: Could not close the question with id: \"" # question.id # "\"");
                            };
                        };
                        case(#PICKANSWER){
                            // Automatically trigger a dispute if the author did not pick a winner
                            ignore await graphql_canister_.open_dispute(question.id, now);
                        };
                        case(#DISPUTABLE){
                            // If nobody disputed the picked answer, close the question
                            // Watchout: this assumes that at this stage the question winner is not null
                            if(await graphql_canister_.close_question(question.id, now)){
                                Option.iterate(question.winner, func(answer: GraphQL.AnswerType){
                                    let payout : PayoutRecord = { reward = question.reward; to = Principal.fromText(answer.author.id); status = #PENDING };
                                    payouts_ := Trie.put(payouts_, {key = question.id; hash = Text.hash(question.id)}, Text.equal, payout).0;
                                });
                            } else {
                                Debug.print("Update: Could not close the question with id: \"" # question.id # "\"");
                            };
                        };
                        case(_){};
                    };
                };
            };
        };
    };

    private func payout() : async () {
        for ((question_id, {reward; to; status;}) in Trie.iter(payouts_)){
            switch(status){
                case(#PENDING){
                    // Proceed with the payout: put the status as ONGOING
                    payouts_ := Trie.put(payouts_, {key = question_id; hash = Text.hash(question_id)}, Text.equal, {reward; to; status = #ONGOING;}).0;
                    // Trigger the transfer
                    switch(await transfer(to, reward)){
                        case(#err(err)) {
                            // Put back the payout as #PENDING
                            payouts_ := Trie.put(payouts_, {key = question_id; hash = Text.hash(question_id)}, Text.equal, {reward; to; status = #PENDING;}).0;
                        };
                        case(#ok(block_height)) {
                            // Put the payout as #DONE with the returned block height
                            payouts_ := Trie.put(payouts_, {key = question_id; hash = Text.hash(question_id)}, Text.equal, {reward; to; status = #DONE(block_height);}).0;
                        };
                    };
                };
                case(#ONGOING){}; // Nothing to do, the payout is being processed
                case(#DONE(block_height)){
                    // @todo: update the question's block height in graphql, remove payout from the trie only if the graphql update succeeded
                    payouts_ := Trie.remove(payouts_, {key = question_id; hash = Text.hash(question_id)}, Text.equal).0;
                };
            };
        };
    };

    // ------------------------- Transfer -------------------------
    private func transfer(to: Principal, amount_e3s: Int32) : async Result.Result<Nat64, Types.Error> {
        switch(Utils.getDefaultAccountIdentifier(to)){
            case (null) {
                return #err(#AccountIdentifierError);
            };
            case (?account_identifier) {
                // Watchout: use a #blob (for destination account) instead of a #principal because with the
                // principal the invoice canister transfer the funds to what seems to be an invoice subaccount...
                switch(await invoice_canister_.transfer({
                    amount = Utils.e3s_to_e8s(amount_e3s);
                    token = {symbol = coin_symbol_};
                    destination = #blob(account_identifier);
                })){
                    case(#err err){
                        return #err(#TransferError(err));
                    };
                    case(#ok success){
                        return #ok(success.blockHeight);
                    };
                };
            };
        };
    };
    
    // ------------------------- Heartbeat -------------------------
    /// TO DO: investigate if the heartbeat function makes sense to update
    /// questions' status or if it should be triggered by something else
    system func heartbeat() : async () {
        if (update_status_on_heartbeat_){
            await update_status();
            await payout();
        };
    };
};