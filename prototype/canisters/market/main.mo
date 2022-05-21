import Types "types";

import Int "mo:base/Int";
import Int32 "mo:base/Int32";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Time "mo:base/Time";

import GraphQL "canister:graphql";
import Invoice "ic:r7inp-6aaaa-aaaaa-aaabq-cai";


shared({ caller = initializer }) actor class Prototype() = this {
 
    let minReward: Nat = 1250000; // @todo: arg in cstor

    // the reward values have to be in a certain range depending on fees. 0.0125 ICP min I would propose. 1250000 e8s.
    // should check for error messages of the create_invoice function.
    public shared ({caller}) func create_invoice (reward: Nat) : async Invoice.CreateInvoiceResult  {
        if(reward < minReward) {
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
                    symbol = "ICP";
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
                    if (await GraphQL.set_winner(question_id, answer_id)){ // @todo: shall choose a winner
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
                            token = {symbol = "ICP"};
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

};