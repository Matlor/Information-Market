import InvoiceTypes "../invoice/types";
import Types        "types";
import DBModule    "./db/db";

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
import Blob         "mo:base/Blob";
import Array        "mo:base/Array";
import Buffer       "mo:base/Buffer";
import Prelude      "mo:base/Prelude";

shared({ caller = admin }) actor class Market(arguments: Types.InstallMarketArguments) = this {

    // for convenience
    type Question = Types.Question;
    type User = Types.User;
    type Invoice = Types.Invoice;
    type Answer = Types.Answer;
    type FinalWinner = Types.FinalWinner;

    // ------------------------- Configutations -------------------------
    
    // Principals
    stable let invoice_principal: Principal = arguments.invoice_canister;

    // Actors
    private let invoice_canister_ : InvoiceTypes.Interface = actor (Principal.toText(invoice_principal));

    // Settings
    private stable var coin_symbol_ : Text = arguments.coin_symbol;
    private stable var min_reward_ : Nat = arguments.min_reward_e8s;
    private stable var fee_ : Nat = arguments.transfer_fee_e8s;
    private stable var duration_pick_answer_ : Int = arguments.pick_answer_duration_minutes;
    private stable var duration_disputable_ : Int = arguments.disputable_duration_minutes;
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

    public shared func get_duration_pick_answer() : async Int {
        return duration_pick_answer_;
    };

    public shared func get_duration_disputable() : async Int {
        return duration_disputable_;
    };

    public shared func get_update_status_on_heartbeat() : async Bool {
        return update_status_on_heartbeat_;
    };

    public shared({caller}) func update_market_params(params: Types.UpdateMarketParams) : async Result.Result<(), Types.StateError>{
        if (caller != admin){ return #err(#NotAllowed) };
        min_reward_ := Option.get(params.min_reward_e8s, min_reward_);
        fee_ := Option.get(params.transfer_fee_e8s, fee_);
        duration_pick_answer_ := Option.get(params.pick_answer_duration_minutes, duration_pick_answer_);
        duration_disputable_ := Option.get(params.disputable_duration_minutes, duration_disputable_);
        return #ok;
    };

    // ------------------------- DB -------------------------
    private var DB: DBModule.DB = DBModule.DB();

    // ------------------- User Managment -------------------
    public shared({caller}) func create_user(name:Text): async Result.Result<User, Types.StateError> {
        return DB.create_user(caller, name);
    };

    // TODO: this is not good, who can call it, and why does it give this type? delete and replace
    public func get_user(user_id:Principal): async ?User {
        return DB.Users.get_user(user_id);
    };

    // TODO: Update user
    // check if user exists already
    // check that caller is user
    // check if blob, username or both should be replaced
    // return User probably
    // public func update_user();

    // ------------------------- Create Invoice -------------------------
    // TODO: think through the errors to show
    public shared ({caller}) func create_invoice(reward: Nat) : async InvoiceTypes.CreateInvoiceResult  {
        if(reward < min_reward_) {
            let invoice_error : InvoiceTypes.CreateInvoiceErr = {kind = #Other; message = ?"Set reward is below minimum"};
            return #err(invoice_error);
        } else {
            switch (DB.Users.get_user(caller)){
                case(null){
                    let invoice_error : InvoiceTypes.CreateInvoiceErr = {kind = #Other; message = ?"Unknown user"};
                    return #err(invoice_error);
                };
                case(?user){
                    let create_invoice_args : InvoiceTypes.CreateInvoiceArgs = {
                        amount = reward + fee_;
                        details = null;
                        permissions = null;
                        token = { symbol = coin_symbol_ };
                    };
                    switch (await invoice_canister_.create_invoice(create_invoice_args)){
                        case (#err create_invoice_err) {return #err(create_invoice_err)};
                        case (#ok create_invoice_success) {
                            switch (DB.create_invoice(create_invoice_success.invoice.id, user.id)){
                                case (#err(_)) {
                                    let invoice_error : InvoiceTypes.CreateInvoiceErr = {kind = #Other;message = ?"DB error"};
                                    return #err(invoice_error);
                                };
                                case (#ok(invoice)) {
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
    public shared ({caller}) func ask_question (
        invoice_id: Nat,
        duration_minutes: Nat,
        title: Text,
        content: Text
    ) : async Result.Result<Question, Types.StateError> {
        switch (DB.Invoices.get_invoice(invoice_id)){
            case (null) { return #err(#InvoiceNotFound) };
            case (?invoice) {
                // buyer of invoice is caller && ensures user exists
                if (invoice.buyer_id != caller) {return #err(#NotAllowed)} 
                else {
                    // Verify the invoice has been paid
                    switch (await invoice_canister_.verify_invoice({id = invoice_id})) {
                        case(#err err) { return #err(#VerifyInvoiceError) };
                        case(#ok verify_invoice_success){
                            // assumes invoice would have the quesiton_id if it was used before
                            if(invoice.question_id != null){ return #err(#NotAllowed) } 
                            else {
                                var invoice_amount : Nat = 0;
                                switch(verify_invoice_success){
                                    case(#AlreadyVerified verified){ invoice_amount := verified.invoice.amount };
                                    case(#Paid paid){ invoice_amount := paid.invoice.amount };
                                };
                                let now = Utils.time_minutes_now();
                                switch (DB.create_question(
                                    caller,
                                    invoice_id, 
                                    duration_minutes,
                                    title,
                                    content,
                                    // TODO: check if this conversion is correct and safe
                                    Utils.nat_to_int32(invoice_amount - fee_) 
                                )){
                                    case(#err(err)) { return #err(err) };
                                    case (#ok(question)) { return #ok(question) };
                                };
                            };
                        };
                    };
                };
            };
        };
    };

    // ------------------------- Answer Question -------------------------
    public shared ({caller}) func answer_question(question_id: Text, content: Text): async Result.Result<Answer, Types.StateError> {
        // ----- time_trigger -----
        ignore update_open(question_id);

        // ----- action_trigger -----
        switch(DB.Questions.get_question(question_id)){
            case(null){ return #err(#QuestionNotFound) };
            case(?question){
                switch (DB.Users.get_user(caller)){
                    case(null){ return #err(#UserNotFound) };
                    case(?user){
                        if (question.author_id == user.id) { return #err(#NotAllowed) } 
                        else {
                            switch(question.status){
                                case(#OPEN){
                                    switch(DB.create_answer(user.id, question_id, content)){
                                        case(#err(error)){ return #err(error) };
                                        case(#ok(answer)){ return #ok(answer) };
                                    };
                                };
                                case(_){return #err(#WrongStatus) };
                            };
                        };
                    };
                };
            };
        };
    };

    // ------------------------- Pick Answer -------------------------
    public shared ({caller}) func pick_answer(question_id: Text, answer_id: Text) : async Result.Result<(), Types.StateError> {
        // ----- time_trigger -----
        ignore update_pick_answer(question_id);
        
        // ----- action_trigger -----
        switch(DB.Questions.get_question(question_id)){
            case(null){ return #err(#QuestionNotFound) };
            case(?question){
                if (question.author_id != caller) { return #err(#NotAllowed)} else {
                    if (question.status != #PICKANSWER) { return #err(#WrongStatus) } else {
                        switch(DB.Answers.get_answer(answer_id)){
                            case(null){ return #err(#AnswerNotFound)};
                            case(?answer){
                                if(answer.question_id != question_id){ return #err(#NotAllowed) } 
                                else {
                                    ignore DB.Questions.pickanswer_to_disputable(question, duration_disputable_, answer_id);
                                    return #ok();
                                }
                            };
                        };
                    }
                };
            };
        };
    };

    // ------------------------- Trigger Dispute -------------------------
    public shared ({caller}) func dispute (question_id: Text): async Result.Result<(), Types.StateError> {
        // ----- time_trigger -----
        ignore update_disputable(question_id);

        // ----- action_trigger -----
        switch(DB.Questions.get_question(question_id)){
            case(null){ return #err(#QuestionNotFound) };
            case(?question){
                let now = Utils.time_minutes_now();
                if (question.status != #DISPUTABLE) { 
                    return #err(#WrongStatus) 
                } else if (not DB.has_user_answered_question(caller, question_id)) {
                    return #err(#NotAllowed)
                } else {
                    ignore DB.Questions.to_arbitration(question);
                    return #ok();
                };
            };
        };
    };

    // ------------------------- Arbitrate -------------------------
    public shared ({caller}) func arbitrate (question_id: Text, finalWinner: FinalWinner): async Result.Result<(), Types.StateError> {
        // ----- action_trigger -----
        switch(DB.Questions.get_question(question_id)){
            case(null){ return #err(#QuestionNotFound) };
            case(?question){
                if (caller != admin){ return #err(#NotAllowed) } 
                else {
                    if (question.status != #ARBITRATION) { return #err(#WrongStatus) } 
                    else {
                        switch(finalWinner){
                            case(#ANSWER({answer_id})){
                                switch (DB.Answers.get_answer(answer_id)) {
                                    case (null) { return #err(#AnswerNotFound) };
                                    case (?answer) {
                                        if (answer.question_id != question_id) {
                                            return #err(#AnswerQuestionMismatch);
                                        } else {
                                            ignore DB.Questions.to_payout(question,  #ANSWER({answer_id}));
                                            return #ok();
                                        }; 
                                    };
                                };
                            };
                            case(#QUESTION){
                                ignore DB.Questions.to_payout(question,  #QUESTION);
                                return #ok();
                            };
                        };
                    };
                };
            };
        };
    }; 
    
    // ------------------------- Time Updates -------------------------
    public func update_open(question_id:Text) : async () {
        let now = Utils.time_minutes_now();
        switch(DB.Questions.get_question(question_id)){
            case(null){ return };
            case(?question){
                if(question.status != #OPEN){ return } else {
                    if(now > question.status_end_date){
                        if(DB.Questions.has_answers(question.answers)){
                            ignore DB.Questions.open_to_pickanswer(question, duration_pick_answer_);
                        } else {
                            ignore DB.Questions.to_payout( question, #QUESTION );
                        };
                    };
                }
            };
        };
    };

    public func update_pick_answer(question_id:Text) : async () {
        let now = Utils.time_minutes_now();
        switch(DB.Questions.get_question(question_id)){
            case(null){ return };
            case(?question){
                if(question.status != #PICKANSWER){ return } else {
                    if(now > question.status_end_date){
                        ignore DB.Questions.to_arbitration(question);
                    };
                };
            };
        };
    };
   
    public func update_disputable(question_id:Text) : async () {
        let now = Utils.time_minutes_now();
        switch(DB.Questions.get_question(question_id)){
            case(null){ return };
            case(?question){
                if(question.status != #DISPUTABLE){ return } else {
                    if(now > question.status_end_date){
                        // TODO: check it Option.iterate is adequate here. Should never be null.
                        Option.iterate(question.potentialWinner, func (potentialWinner: Text) : () {
                            ignore DB.Questions.to_payout(question, #ANSWER({answer_id = potentialWinner}) );
                        });
                    };
                };
            };
        };
    };

    // The payout sub-states are a separate state-machine
    public func update_payout(question_id:Text) : async () {
        func pay (question: Question, id: Principal): async () {
            ignore DB.Questions.pay_to_ongoing(question);
            switch(await transfer(id, question.reward)){
                case(#ok block_height){ ignore DB.Questions.ongoing_to_close(question, block_height) };
                case(#err(error)){ ignore DB.Questions.ongoing_to_pay(question); };
            }
        };
        switch(DB.Questions.get_question(question_id)){
            case(null){ return };
            case(?question){
                // TODO: test this syntax
                if(question.status != #PAYOUT(#ONGOING) and question.status != #PAYOUT(#PAY)){ return } else {
                    switch(question.finalWinner){
                        // we should always have a defined final winner here
                        case(null){Prelude.unreachable()};
                        case(?finalWinner){
                            switch(finalWinner){
                                case(#QUESTION){ await pay(question, question.author_id) };
                                case(#ANSWER({answer_id})){ 
                                    switch(DB.Answers.get_answer(answer_id)){
                                        // should always be legitimate answer of question
                                        case(null){ Prelude.unreachable() };
                                        case(?answer){ 
                                            await pay(question, answer.author_id);
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
    };

    // ------------------------- Transfer -------------------------
    private func transfer(to: Principal, amount_e3s: Int32) : async Result.Result<Nat64, Types.StateError> {
        switch(Utils.getDefaultAccountIdentifier(to)){
            case (null) { return #err(#AccountIdentifierError) };
            case (?account_identifier) {
                // Watchout: use a #blob (for destination account) instead of a #principal because with the
                // principal the invoice canister transfer the funds to what seems to be an invoice subaccount...
                switch(await invoice_canister_.transfer({
                    amount = Utils.e3s_to_e8s(amount_e3s);
                    token = {symbol = coin_symbol_};
                    destination = #blob(account_identifier);
                })){
                    case(#err err){ return #err(#TransferError(err)) };
                    case(#ok success){ return #ok(success.blockHeight) };
                };
            };
        };
    }; 

    // ------------------------- Heartbeat -------------------------
    // Intuition: Heartbeat simply simulates a user. All the functions it calls are public.
    system func heartbeat() : async () {
        if (update_status_on_heartbeat_){
            // this is rather inefficient as I get the questions only to pass the ids to get them again
            // in the time functions. Benefit is that I can check the status.
            let questions: [Question] = DB.Questions.get_unclosed_questions();
            label l for (question in Iter.fromArray<Question>(questions)) {
                switch(question.status){
                    case(#OPEN){
                        ignore update_open(question.id);
                    };
                    case(#PICKANSWER){ 
                        ignore update_pick_answer(question.id);
                    };
                    case(#DISPUTABLE){ 
                        ignore update_disputable(question.id);
                    };
                    case(#PAYOUT(#PAY)){  
                        ignore update_payout(question.id);
                    };
                    case(_){ return };
                };
            };
        };
    }; 
};