import Types "types";

import Int "mo:base/Int";
import Int32 "mo:base/Int32";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Time "mo:base/Time";

import GraphQL "canister:graphql";
import Invoice "ic:r7inp-6aaaa-aaaaa-aaabq-cai";


shared({ caller = initializer }) actor class Market(
    coin_symbol: Text,
    min_reward: Nat,
    duration_open: Nat,
    duration_pick_answer: Nat,
    duration_disputable: Nat
) = this {
 
    // Members
    private let coin_symbol_ : Text = coin_symbol;
    private let min_reward_ : Nat = min_reward;
    private let duration_open_ : Int = duration_open;
    private let duration_pick_answer_ : Int = duration_pick_answer;
    private let duration_disputable_ : Int = duration_disputable;

    // the reward values have to be in a certain range depending on fees. 0.0125 ICP min I would propose. 1250000 e8s.
    // should check for error messages of the create_invoice function.
    public shared ({caller}) func create_invoice (reward: Nat) : async Invoice.CreateInvoiceResult  {
        if(reward < min_reward_) {
            let invoice_error : Invoice.CreateInvoiceErr = {
                kind = #Other;
                message = ?"Set reward is below minimum";
            };
            return #err(invoice_error);
        } else {
            let create_invoice_args : Invoice.CreateInvoiceArgs = {
                amount = reward;
                details = null;
                permissions = null;
                token = { 
                    symbol = coin_symbol_;
                };
            };
            switch (await Invoice.create_invoice(create_invoice_args)){
                case (#err create_invoice_err) {
                    return #err(create_invoice_err);
                };
                case (#ok create_invoice_success) {
                    switch (await GraphQL.create_invoice(Nat.toText(create_invoice_success.invoice.id), Principal.toText(caller))) {
                        case (null) {
                            let invoice_error : Invoice.CreateInvoiceErr = {
                                kind = #Other;
                                message = ?"Database mutation error";
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

    public shared ({caller}) func ask_question (
        invoice_id: Nat,
        content: Text
    ) : async Result.Result<GraphQL.QuestionType, Types.OpenQuestionError> {
        let author = Principal.toText(caller);
        // Verify that the invoice exists in database
        switch (await GraphQL.get_invoice(Nat.toText(invoice_id))){
            case (null) {
                return #err(#IncorrectDeadline);
            };
            case (?graphql_invoice) {
                // Verify the buyer of the invoice is the user that is opening up the question
                if (graphql_invoice.buyer != author) {
                    return #err(#IncorrectDeadline);
                } else {
                    switch (await Invoice.verify_invoice({id = invoice_id})) {
                         case(#err err) {  
                            return #err(#IncorrectDeadline);
                        };
                        case(#ok verify_invoice_success){
                            var invoice_amount : Int = 0;
                            switch(verify_invoice_success){
                                case(#AlreadyVerified verified){
                                    switch(await GraphQL.get_question_by_invoice(Nat.toText(invoice_id))){
                                        case(?question){
                                            return #err(#IncorrectDeadline);
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
                            switch (await GraphQL.create_question(
                                author,
                                Nat.toText(invoice_id),
                                Int32.fromInt(Time.now()),
                                #OPEN,
                                Int32.fromInt(Time.now()),
                                content,
                                Int32.fromInt(invoice_amount))){
                                case(null) {
                                    return #err(#IncorrectDeadline);
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

    // ------------------------- Answers -------------------------

    public shared ({caller}) func answer_question(
        question_id: Text,
        content: Text
    ): async Result.Result<GraphQL.AnswerType, Types.AnswerError> {
        let author = Principal.toText(caller);
        switch(await GraphQL.get_question(question_id)){
             case(null){
                return (#err(#QuestionNotFound));
            };
            case(?question){
                if (question.author == author) {
                    return (#err(#YouAreOwner));
                } else if (question.status != #OPEN) {
                    return (#err (#WrongTimeInterval));
                } else {
                    switch(await GraphQL.create_answer(
                        question_id,
                        author,
                        Int32.fromInt(Time.now()),
                        content)){
                        case(null){
                            return (#err(#QuestionNotFound));
                        };
                        case(?answer){
                            return #ok(answer);
                        };
                    };
                };
            };
        }; 
    };

    // ------------------------- Pick Winner -------------------------
    public shared ({caller}) func pick_winner(
        question_id: Text,
        answer_id: Text
        ) : async Result.Result<(), Types.PickWinnerError> {
        switch(await GraphQL.get_question(question_id)){
             case(null){
                return (#err(#QuestionNotFound));
            };
            case(?question){
                if (question.author == Principal.toText(caller)) {
                    return (#err(#YouAreNotOwner));
                } else if (question.status != #PICKANSWER) {
                    return (#err (#WrongTimeInterval));
                } else {
                    // @todo: rename method into pick_answer, add modification of status and add time as parameter
                    if (await GraphQL.set_winner(question_id, answer_id)){
                        return #ok();
                    } else {
                        return #err(#AnswerDoesNotExist);
                    };
                };
            };
        };
    };

    // ------------------------- Dispute -------------------------

    // TO DO: Nothing prevents spam at the moment. In case function would cost, it should be free to call if owner did not pick a winner.
    public shared ({caller}) func trigger_dispute(
        question_id: Text
    ): async Result.Result<GraphQL.DisputeType, Types.TriggerDisputeError> {
        switch(await GraphQL.get_question(question_id)){
             case(null){
                return (#err(#QuestionNotFound));
            };
            case(?question){
                if (question.status != #DISPUTABLE) {
                    return (#err (#WrongTimeInterval));
                } else if (not(await GraphQL.has_answered(question_id, Principal.toText(caller)))) {
                    return #err(#CallerDidNotAnswer);
                } else {
                    switch(await GraphQL.create_dispute(question_id, Int32.fromInt(Time.now()))){
                        case(null){
                            return (#err(#CallerDidNotAnswer));
                        };
                        case(?dispute){
                            return #ok(dispute);
                        };
                    };
                }
            };
        };
    };

    // ------------------------- Arbitration -------------------------

    // centralised version: contract deployer is arbitor
    // TO DO: case is not handled where no arbitration occurs.
    public shared ({caller}) func arbitrate(
        question_id: Text,
        answer_id: Text
    ): async Result.Result<(), Types.ArbitrationError> {
        if (caller != initializer){
            return #err(#CallerIsNotArbitor);
        };
        switch(await GraphQL.get_question(question_id)){
             case(null){
                return (#err(#QuestionNotFound));
            };
            case(?question){
                if (question.status != #DISPUTED) {
                    return (#err (#WrongTimeInterval));
                } else {
                    if (await GraphQL.set_winner(question_id, answer_id)){
                        return #ok();
                    } else {
                        return (#err(#WrongTimeInterval));
                    };
                };
            };
        };
    };

    // ------------------------- Payout -------------------------


    // everyone can call this function.
    // TO DO: payout does not consider that triggering a dispute should cost a fee.
    // TO DO: payout does not consider that a questioner needs incentives to pick a winner.
    // TO DO: the case is not handled that the arbitor never does it's job.
    func payout(question_id: Text): async Result.Result<Nat64, Types.PayoutError> {
        switch(await GraphQL.get_question(question_id)){
             case(null){
                return (#err(#QuestionNotFound));
            };
            case(?question){
                switch(question.winner){
                    case(null){
                        return (#err(#QuestionNotFound));
                    };
                    case (?answer){
                        switch(await Invoice.transfer({
                            amount = Int.abs(Int32.toInt(question.reward));
                            token = {symbol = coin_symbol_};
                            destination = #principal(Principal.fromText(answer.author));
                        })){
                            case(#err err){
                                return #err(#TransferFailed(err));
                            };
                            case(#ok success){
                                return #ok(success.blockHeight);
                            };
                        };
                    };
                };
            };
        };
    };

    /// Update the questions' status
    /// TODO: investigate if hearbeat is good for that, or if this function could be 
    /// somehow triggered from the UI
    system func heartbeat() : async () {
        let now = Int32.fromInt(Time.now());
        let questions : [GraphQL.QuestionType] = await GraphQL.get_questions();
        for (question in Iter.fromArray<GraphQL.QuestionType>(questions))
        {
            switch(question.status){
                case(#OPEN){
                    if (question.status_update_date + Int32.fromInt(duration_open_) > now) {
                        // @todo: what to do if the status ever failed to be updated?
                        ignore await GraphQL.set_status(question.id, #PICKANSWER, now);
                    };
                };
                case(#PICKANSWER){
                    if (question.status_update_date + Int32.fromInt(duration_pick_answer_) > now) {
                        // Automatically trigger a dispute if the question's author did 
                        // not pick a winner
                        ignore await GraphQL.create_dispute(question.id, now);
                    };
                };
                case(#DISPUTABLE){
                    if (question.status_update_date + Int32.fromInt(duration_disputable_) > now) {
                        // If nobody disputed the picked answer, payout the answer's author
                        // and close the question
                        // @todo: what to do if the payout ever fails ? Probably requires an
                        // intermediate state to loop on
                        // @todo: add the block height of the payout in the question
                        ignore await payout(question.id);
                        // @todo: what to do if the status ever failed to be updated?
                        ignore await GraphQL.set_status(question.id, #CLOSED, now);
                    };
                };
                case(_){
                };
            };
        };
    };
};