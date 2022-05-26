import InvoiceTypes "../invoice/types";
import Types        "types";
import Utils        "utils";

import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Int32 "mo:base/Int32";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Time "mo:base/Time";

import GraphQL "canister:graphql";


shared({ caller = initializer }) actor class Market(
    invoice_canister: Text,
    coin_symbol: Text,
    min_reward: Nat, // in e8s
    fee: Nat, // in e8s, shall be 10000
    duration_open: Nat, // in minutes
    duration_pick_answer: Nat, // in minutes
    duration_disputable: Nat // in minutes
) = this {

    // Members
    private let invoice_canister_ : InvoiceTypes.Interface = actor (invoice_canister);
    private let coin_symbol_ : Text = coin_symbol;
    private let min_reward_ : Nat = min_reward;
    private let fee_ : Nat = fee;
    private let duration_open_ : Int = duration_open;
    private let duration_pick_answer_ : Int = duration_pick_answer;
    private let duration_disputable_ : Int = duration_disputable;

    // ------------------------- Initialization -------------------------

    // There seems to be a bug in graphql, if the first mutation called on the graphql
    // canister is a custom mutation (not the graphql_mutation(text, text) -> text), then
    // the graphql mutations traps. Here we do a dummy mutation to create an "Initialization"
    // table inside the graphql database so the next mutations performed by this canister work.
    public shared func initialize_graphql() : async Bool {
        if (not (await is_graphql_initialized()))
        {
            return Text.startsWith(
                await GraphQL.graphql_mutation("mutation{createInitialization{id}}", "{}"),
                #text("{\"data\":{\"createInitialization\":[{\"id\""));
        }
        return true;
    };

    // Check if there is an "Initialization" table inside the GraphQL database. This is
    // required because it can happen in development that the graphql canister is re-deployed 
    // alone, so one need to call the initialize_graphql function once again.
    public shared func is_graphql_initialized() : async Bool {
        return Text.startsWith(
            await GraphQL.graphql_query("query{readInitialization{id}}", "{}"),
            #text("{\"data\":{\"readInitialization\":[{\"id\""));
    };

    // ------------------------- Create Invoice -------------------------

    public shared ({caller}) func create_invoice (reward: Nat) : async InvoiceTypes.CreateInvoiceResult  {
        if(reward < min_reward_) {
            let invoice_error : InvoiceTypes.CreateInvoiceErr = {
                kind = #Other;
                message = ?"Set reward is below minimum";
            };
            return #err(invoice_error);
        } else {
            let create_invoice_args : InvoiceTypes.CreateInvoiceArgs = {
                amount = reward + fee_;
                details = null;
                permissions = null;
                token = { 
                    symbol = coin_symbol_;
                };
            };
            switch (await invoice_canister_.create_invoice(create_invoice_args)){
                case (#err create_invoice_err) {
                    return #err(create_invoice_err);
                };
                case (#ok create_invoice_success) {
                    switch (await GraphQL.create_invoice(
                        Nat.toText(create_invoice_success.invoice.id),
                        Principal.toText(caller)
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

    // ------------------------- Ask Question -------------------------

    public shared ({caller}) func ask_question (
        invoice_id: Nat,
        content: Text
    ) : async Result.Result<GraphQL.QuestionType, Types.Error> {
        let author = Principal.toText(caller);
        // Verify that the invoice exists in database
        switch (await GraphQL.get_invoice(Nat.toText(invoice_id))){
            case (null) {
                return #err(#NotFound);
            };
            case (?graphql_invoice) {
                // Verify the buyer of the invoice is the user that is opening up the question
                if (graphql_invoice.buyer != author) {
                    return #err(#NotAllowed);
                } else {
                    // Verify the invoice has been paid
                    switch (await invoice_canister_.verify_invoice({id = invoice_id})) {
                         case(#err err) {  
                            return #err(#VerifyInvoiceError);
                        };
                        case(#ok verify_invoice_success){
                            var invoice_amount : Int = 0;
                            switch(verify_invoice_success){
                                case(#AlreadyVerified verified){
                                    // If it has already been verified, check that no
                                    // question already exists for this invoice
                                    switch(await GraphQL.get_question_by_invoice(Nat.toText(invoice_id))){
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
                            switch (await GraphQL.create_question(
                                author,
                                Nat.toText(invoice_id),
                                Utils.time_minutes_now(),
                                Utils.time_minutes_now(),
                                content,
                                Int32.fromInt(invoice_amount - fee_)
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

    public shared ({caller}) func answer_question(
        question_id: Text,
        content: Text
    ): async Result.Result<GraphQL.AnswerType, Types.Error> {
        let author = Principal.toText(caller);
        // Check the question exists
        switch(await GraphQL.get_question(question_id)){
             case(null){
                return #err(#NotFound);
            };
            case(?question){
                // Verify one does not attempt to answer its own question
                if (question.author == author) {
                    return #err(#NotAllowed);
                // Verify the question is open
                } else if (question.status != #OPEN) {
                    return #err(#WrongStatus);
                } else {
                    switch(await GraphQL.create_answer(
                        question_id,
                        author,
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

    // ------------------------- Pick Winner -------------------------

    // TO DO: (optimisation) ideally one could have spare the call to GraphQL.get_question if a variable
    // question: QuestionType is added to the AnswerType inside the graphql.rs canister
    public shared ({caller}) func pick_winner(
        question_id: Text,
        answer_id: Text
        ) : async Result.Result<(), Types.Error> {
        switch(await GraphQL.get_question(question_id)){
             case(null){
                return #err(#NotFound);
            };
            case(?question){
                if (question.author != Principal.toText(caller)) {
                    return #err(#NotAllowed);
                } else if (question.status != #PICKANSWER) {
                    return #err(#WrongStatus);
                } else if ((await GraphQL.get_answer(question_id, answer_id)) == null) {
                    return #err(#NotFound);
                } else  if (not (await GraphQL.pick_winner(question_id, answer_id, Utils.time_minutes_now()))){
                    return #err(#GraphQLError);
                } else {
                    return #ok();
                };
            };
        };
    };

    // ------------------------- Trigger Dispute -------------------------

    // TO DO: opening a dispute shall cost a fee. This fee shall reward the arbitrator.
    public shared ({caller}) func trigger_dispute(
        question_id: Text
    ): async Result.Result<(), Types.Error> {
        switch(await GraphQL.get_question(question_id)){
             case(null){
                return #err(#NotFound);
            };
            case(?question){
                if (question.status != #DISPUTABLE) {
                    return #err(#WrongStatus);
                } else if (not(await GraphQL.has_answered(question_id, Principal.toText(caller)))) {
                    return #err(#NotAllowed);
                } else if (not (await GraphQL.open_dispute(question_id, Utils.time_minutes_now()))){
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
    public shared ({caller}) func arbitrate(
        question_id: Text,
        answer_id: Text
    ): async Result.Result<(), Types.Error> {
        if (caller != initializer){
            return #err(#NotAllowed);
        };
        switch(await GraphQL.get_question(question_id)){
             case(null){
                return #err(#NotFound);
            };
            case(?question){
                if (question.status != #DISPUTED) {
                    return #err(#WrongStatus);
                } else {
                    switch (await GraphQL.get_answer(question_id, answer_id)) {
                        case (null) {
                            return #err(#NotFound);
                        };
                        case (?answer) {
                            switch(await invoice_canister_.transfer({
                                amount = Int.abs(Int32.toInt(question.reward));
                                token = {symbol = coin_symbol_};
                                destination = #principal(Principal.fromText(answer.author));
                            })){
                                case(#err err){
                                    return #err(#TransferError(err));
                                };
                                case(#ok success){
                                    // Here there is in theory a severe risk that the transfer worked 
                                    // but the question is not closed, hence it would be possible to have
                                    // multiple transfers for the same question
                                    // TO DO: use a hashmap <question_id, blockHeight> to store the transfer
                                    // in motoko, to be able to ensure that the question has not already been paid
                                    if(await GraphQL.solve_dispute(
                                        question_id,
                                        answer_id,
                                        Nat64.toText(success.blockHeight),
                                        Utils.time_minutes_now()
                                    )){
                                        return #ok();
                                    } else {
                                        Debug.print("Failed to reward the winner for question \"" # question.id # "\"");
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

    public func update_status() : async () {
        let now = Utils.time_minutes_now();
        let questions : [GraphQL.QuestionType] = await GraphQL.get_questions();
        for (question in Iter.fromArray<GraphQL.QuestionType>(questions))
        {
            switch(question.status){
                case(#OPEN){
                    if (question.status_update_date + Int32.fromInt(duration_open_) < now) {
                        if (await GraphQL.has_answers(question.id)){
                            // Update the question's state, the author must pick an answer
                            Debug.print("Update question \"" # question.id # "\" status to PICKANSWER");
                            ignore await GraphQL.must_pick_answer(question.id, now);
                        } else {
                            // Refund the author if no answer has been given
                            switch(await invoice_canister_.transfer({
                                amount = Int.abs(Int32.toInt(question.reward));
                                token = {symbol = coin_symbol_};
                                destination = #principal(Principal.fromText(question.author));
                            })){
                                case(#ok success){
                                    // Here there is in theory a severe risk that the transfer worked 
                                    // but the question is not closed, hence it would be possible to have
                                    // multiple transfers for the same question
                                    // TO DO: use a hashmap <question_id, blockHeight> to store the transfer
                                    // in motoko, to be able to ensure that the question has not already been paid
                                    Debug.print("Update question \"" # question.id # "\" status to CLOSE");
                                    ignore await GraphQL.close_question(question.id, Nat64.toText(success.blockHeight), now);
                                };
                                case(_){
                                    Debug.print("Failed to reward the author for question \"" # question.id # "\"");
                                };
                            };
                        };
                    };
                };
                case(#PICKANSWER){
                    if (question.status_update_date + Int32.fromInt(duration_pick_answer_) < now) {
                        Debug.print("Update question \"" # question.id # "\" status to DISPUTED");
                        // Automatically trigger a dispute if the author did not pick a winner
                        ignore await GraphQL.open_dispute(question.id, now);
                    };
                };
                case(#DISPUTABLE){
                    if (question.status_update_date + Int32.fromInt(duration_disputable_) < now) {
                        // If nobody disputed the picked answer, payout the answer's author
                        // and close the question
                        switch (question.winner) {
                            case (null){
                                // Nothing to do, it will never happen if we make sure the question 
                                // is never put in DISPUTABLE state without having a winner
                            };
                            case (?answer){
                                // Pay the winner
                                switch(await invoice_canister_.transfer({
                                    amount = Int.abs(Int32.toInt(question.reward));
                                    token = {symbol = coin_symbol_};
                                    destination = #principal(Principal.fromText(answer.author));
                                })){
                                    case(#ok success){
                                        // Here there is in theory a severe risk that the transfer worked 
                                        // but the question is not closed, hence it would be possible to have
                                        // multiple transfers for the same question
                                        // TO DO: use a hashmap <question_id, blockHeight> to store the transfer
                                        // in motoko, to be able to ensure that the question has not already been paid
                                        Debug.print("Update question \"" # question.id # "\" status to CLOSED");
                                        ignore await GraphQL.close_question(question.id, Nat64.toText(success.blockHeight), now);
                                    };
                                    case(_){
                                        Debug.print("Failed to reward the winner for question \"" # question.id # "\"");
                                    };
                                };
                            };
                        };
                    };
                };
                case(_){
                };
            };
        };
    };

    
    // ------------------------- Heartbeat -------------------------

    /// TO DO: investigate if the hearbeat function makes sense to update
    /// questions' status or if it should be triggered by something else
    system func heartbeat() : async () {
        await update_status();
    };
};