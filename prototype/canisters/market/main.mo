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
        return #ok;
    };

    // ------------------------- Transactions -------------------------
    // These transactions are needed to sync the state between the ledger and graphql temporarily
    // Otherwise, during some time, graphql would not be updated yet but the transfers would be already done
    // This would lead to payouts being done several times
    // When graphql has correctly updated the question status to CLOSE the transactions are deleted 
    var transactions_ : Trie.Trie<Text, (Principal, Nat64)> =  Trie.empty<Text, (Principal, Nat64)>();

    func getTransaction(id:Text): ?(Principal, Nat64) {
        return Trie.get(transactions_, {key=id; hash=Text.hash(id)}, Text.equal);
    };

    func putTransaction(id:Text, principal:Principal, blockHeight:Nat64): () {
        let (latestTransactions, previousTransactions) : (Trie.Trie<Text, (Principal, Nat64)>, ?(Principal, Nat64)) = Trie.put(transactions_, {key=id; hash=Text.hash(id)}, Text.equal, (principal, blockHeight));
        transactions_ := latestTransactions;
    };

    func removeTransaction(id:Text): () {
        let (latestTransactions, previousTransactions) : (Trie.Trie<Text, (Principal, Nat64)>, ?(Principal, Nat64)) =  Trie.remove(transactions_, {key=id; hash=Text.hash(id)}, Text.equal);
        transactions_ := latestTransactions;
    };

    public func getTransactions() : async Trie.Trie<Text, (Principal, Nat64)> {
        return transactions_;
    };

    // ------------------------- User Management -------------------------
    // TO DO: does this function need blockers as well to not be called several times?
    public shared ({caller}) func create_user(name: Text) : async Result.Result<GraphQL.UserType, Types.Error> {
        switch (await graphql_canister_.get_user(Principal.toText(caller))){
            case(?user){
                return #err(#UserExists);
            };
            case(null){
                switch (await graphql_canister_.create_user(Principal.toText(caller), name, Utils.time_minutes_now())){
                    case(null) {
                        return #err(#GraphQLError);
                    };
                    case (?user) {
                        return #ok(user);
                    };
                };
            };
        };
    };

    // TO DO: does this function need blockers as well to not be called several times?
    public shared ({caller}) func update_user(name: Text, avatar: ?Text) : async Result.Result<GraphQL.UserType, Types.Error> {
        switch (await graphql_canister_.get_user(Principal.toText(caller))){
            case(null){
                return #err(#UserNotFound);
            };
            case(?user){
                switch (await graphql_canister_.update_user(Principal.toText(caller), name, avatar)){
                    case(null) {
                        return #err(#GraphQLError);
                    };
                    case (?user) {
                        return #ok(user);
                    };
                };
            };
        };
    };

    // ------------------------- Create Invoice -------------------------
    // TO DO: does this function need blockers as well to not be called several times?
    public shared ({caller}) func create_invoice(reward: Nat) : async InvoiceTypes.CreateInvoiceResult  {
        if(reward < min_reward_) {
            let invoice_error : InvoiceTypes.CreateInvoiceErr = {
                kind = #Other;
                message = ?"Set reward is below minimum";
            };
            return #err(invoice_error);
        } else {
            let create_invoice_args : InvoiceTypes.CreateInvoiceArgs = {
                // rounding up as graphql is using e3s
                // the difference is low enough to be irrelevant for the user
                amount = Utils.round_up_to_e3s(reward) + fee_;
                details = null;
                permissions = null;
                token = { 
                    symbol = coin_symbol_;
                };
            };
            switch (await graphql_canister_.get_user(Principal.toText(caller))){
                case(null){
                    let invoice_error : InvoiceTypes.CreateInvoiceErr = {
                        kind = #Other;
                        message = ?"Unknown user";
                    };
                    return #err(invoice_error);
                };
                case(?user){
                    switch (await invoice_canister_.create_invoice(create_invoice_args)){
                        case (#err create_invoice_err) {
                            return #err(create_invoice_err);
                        };
                        case (#ok create_invoice_success) {
                            switch (await graphql_canister_.create_invoice(
                                Nat.toText(create_invoice_success.invoice.id),
                                user.id
                            )){
                                case (null) {
                                    let invoice_error : InvoiceTypes.CreateInvoiceErr = {
                                        kind = #Other;
                                        message = ?"GraphQL error";
                                    };
                                    return #err(invoice_error);
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
                } else {
                    switch (await graphql_canister_.get_answer(question_id, answer_id)) {
                        case (null) {
                            return #err(#NotFound);
                        };
                        case (?answer) {
                            // -------------- Payout & Close --------------
                            // Pay if not paid already
                            await satisfyPayout(question.id, question.reward, Principal.fromText(answer.author.id));
                                  
                            // Close
                            switch(getTransaction(question.id)){
                                case(null){
                                    return #err(#UnpaidReward);
                                };
                                case(?transaction){
                                    // Checks that winner on graphql == reward receiver (if paid already)
                                    if(Principal.fromText(answer.author.id) != transaction.0){
                                        Debug.print("Arbitration: Principal of answer does not match paid winner: \"" # question.id # "\"");
                                        return #err(#WrongPrincipal)
                                    };
                                    if(await graphql_canister_.solve_dispute(
                                        question_id, 
                                        answer_id, 
                                        Nat64.toText(transaction.1), 
                                        Utils.time_minutes_now()
                                    )){
                                        removeTransaction(question.id);
                                        return #ok();
                                    } else {
                                        Debug.print("Arbitration: Could not solve_dispute for the question with id: \"" # question.id # "\"");
                                        return #err(#GraphQLError);
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
    };

    // ------------------------- Update status -------------------------
    // TO DO: What happens during upgrades?
    var blocker:Bool = false;

    // TODO: Should only iterate over question that are not CLOSED
    public func update_status() : async () {
        // ensure function only runs once at a time
        if(blocker){
            return;
        } else {
            blocker := true;
        };

        let now = Utils.time_minutes_now();
        // It might be a small risk that this is a query
        let questions : [GraphQL.QuestionType] = await graphql_canister_.get_questions();
        label questionsLoop for (question in Iter.fromArray<GraphQL.QuestionType>(questions)) {
            switch(question.status){
                case(#OPEN){
                    if (now >= question.status_end_date) {
                        if (await graphql_canister_.has_answers(question.id)){
                            // Update the question's state, the author must pick an answer
                            ignore await graphql_canister_.must_pick_answer(question.id, now, now + duration_pick_answer_);
                            continue questionsLoop;
                        } else {
                            // ------------------ REFUND - Payout & Close ------------------ 
                            // Pay if not paid already
                            await satisfyPayout(question.id, question.reward, Principal.fromText(question.author.id));
                            // Close
                            switch(getTransaction(question.id)){
                                case(null){
                                    continue questionsLoop;
                                };
                                case(?transaction){
                                    if(await graphql_canister_.close_question(
                                        question.id, 
                                        Nat64.toText(transaction.1), 
                                        now
                                    )){
                                        removeTransaction(question.id);
                                        continue questionsLoop;
                                    } else {
                                        Debug.print("Update: Could not close the question with id: \"" # question.id # "\"");
                                        continue questionsLoop;
                                    };
                                }; 
                            };
                        };
                    };
                };
                case(#PICKANSWER){
                    if (now >= question.status_end_date) {
                        // Automatically trigger a dispute if the author did not pick a winner
                        ignore await graphql_canister_.open_dispute(question.id, now);
                        continue questionsLoop;
                    };
                };
                case(#DISPUTABLE){
                    if (now >= question.status_end_date) {
                        // If nobody disputed the picked answer, payout the answer's author
                        // and close the question
                        switch (question.winner) {
                            case (null){
                                // This should never happen if we make sure the question 
                                // is never put in DISPUTABLE state without having a winner
                                continue questionsLoop;
                            };
                            case (?answer){
                                // ------------------ UNDISPUTED WINNER - Payout & Close ------------------
                                // Pay if not paid already
                                await satisfyPayout(question.id, question.reward, Principal.fromText(answer.author.id));
                                
                                // Close
                                switch(getTransaction(question.id)){
                                    case(null){
                                        continue questionsLoop;
                                    };
                                    case(?transaction){
                                        if(await graphql_canister_.close_question(
                                            question.id, 
                                            Nat64.toText(transaction.1), 
                                            now
                                        )){
                                            removeTransaction(question.id);
                                            continue questionsLoop;
                                        
                                        } else {
                                            continue questionsLoop;
                                        };   
                                    }; 
                                };
                            };
                        };
                    };
                };
                case(_){
                    continue questionsLoop;
    
                };
            };
        };
        blocker:=false;
    };

    // ------------------------- Satisfy Payout -------------------------
    private func satisfyPayout (question_id:Text, reward:Int32, principal: Principal): async () {
        switch(getTransaction(question_id)){
            case(null){
                switch(await transfer(principal, reward)){
                    case(#ok block_height){
                        putTransaction(question_id, principal, block_height);
                    };
                    case(#err _){
                    };
                };
            };
            case(?transaction){
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
        };
    };
};