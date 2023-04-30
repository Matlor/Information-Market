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
import Prim         "mo:prim";

import Types        "types";
import DBModule    "./db/db";
import LedgerTypes  "../ledger/ledgerTypes";
import A            "invoice/Account";


shared({ caller }) actor class Market(arguments: Types.InstallMarketArguments) = this {

    // ---------------- Actors  ----------------
    stable let ledger_principal: Principal = arguments.ledger_canister;
    private let ledger_canister_: LedgerTypes.Interface = actor (Principal.toText(ledger_principal));

    // ---------------- Controllers ----------------
    let IC = actor "aaaaa-aa" : actor {canister_status : { canister_id : Principal } -> async {  
            settings : { controllers : [Principal] } 
        };
    };

    public func get_controllers() : async [Principal] {
        let principal = Principal.fromActor(this);
        let status = await IC.canister_status({ canister_id = principal });
        return status.settings.controllers;
    };

    func callerIsController(caller:Principal) : async Bool {
        let controllers = await get_controllers();
        switch(Array.find<Principal>(controllers, func (x:Principal) : Bool { x == caller })) {
            case (?p) { return true };
            case null { return false };
        };
    };

    // ---------------- Settings ----------------
    private stable var coin_symbol_ : Text = arguments.coin_symbol;
    private stable var min_reward_ : Nat = arguments.min_reward_e8s;
    private stable var fee_ : Nat = arguments.transfer_fee_e8s;
    private stable var duration_pick_answer_ : Int32 = arguments.pick_answer_duration_minutes;
    private stable var duration_disputable_ : Int32 = arguments.disputable_duration_minutes;
    private stable var update_status_on_heartbeat_: Bool = arguments.update_status_on_heartbeat;

    // set settings
    public shared({caller}) func update_market_params(params: Types.UpdateMarketParams) : async Result.Result<(), Types.Error>{
        if (not (await callerIsController(caller))){ return #err(#NotAllowed) };
        min_reward_ := Option.get(params.min_reward_e8s, min_reward_);
        fee_ := Option.get(params.transfer_fee_e8s, fee_);
        duration_pick_answer_ := Option.get(params.pick_answer_duration_minutes, duration_pick_answer_);
        duration_disputable_ := Option.get(params.disputable_duration_minutes, duration_disputable_);
        return #ok;
    };

    // --- get settings ---
    public query func get_coin_symbol() : async Text {
        return coin_symbol_;
    };

    public query func get_min_reward() : async Nat {
        return min_reward_;
    };

    public query func get_fee() : async Nat {
        return fee_;
    };

    public query func get_duration_pick_answer() : async Int32 {
        return duration_pick_answer_;
    };

    public query func get_duration_disputable() : async Int32 {
        return duration_disputable_;
    };

    public query func get_update_status_on_heartbeat() : async Bool {
        return update_status_on_heartbeat_;
    };

    // ---------------- DB ----------------
    // TODO: I could think if I should pass around Buffers internally and only for async actor turn it into array
    private var DB: DBModule.DB = DBModule.DB();

    public shared({caller}) func set_db(initial_state:Types.State): async Result.Result<Types.State, Types.Error>{
        // TODO: (test_runner needs to deploy market) await callerIsController(caller)
        if (not (true)){ return #err(#NotAllowed) } else {
            DB.set_inner_state(initial_state);
            #ok(DB.get_state());
        };
    };
    
    public shared({caller}) func get_db(): async Result.Result<Types.State, Types.Error> {
        // TODO: (test_runner needs to deploy market) await callerIsController(caller)
        if (not (true)){ return #err(#NotAllowed) } else {
            #ok(DB.get_state());
        };
    };

    // ---------------- Queries ----------------

    public query func get_conditional_questions(filters:Types.Filter_Options, search:Text, sort_by: Types.Sort_Options,  start:Nat32, length:Nat32 ): async [Types.Question] {
        DB.Questions.get_conditional_questions(filters, search, sort_by,  start, length);
    };

    public query func get_conditional_questions_with_authors(filters:Types.Filter_Options, search:Text, myInteractions:?Principal, sort_by:Types.Sort_Options, start:Nat32, length:Nat32) : async {data:[{question:Types.Question; author:Types.User}]; num_questions:Nat32} {
        DB.get_conditional_questions_with_authors(filters, search, myInteractions, sort_by, start, length);
    };

    public query func get_users(user_ids:[Principal]): async [Types.User] {
        DB.Users.get_users(user_ids);
    };

    public query func get_question_data(question_id:Text): async ?{question:Types.Question; users:[Types.User]; answers:[Types.Answer]} {
        DB.get_question_data(question_id);
    };

    // ---------------- User Managment ----------------
    // TODO: Delete everything around it for now
    public query func get_user(user_id:Principal): async ?Types.User {
        return DB.Users.get_user(user_id);
    };
   
    // TODO: Delete everything around it for now
    public shared({caller}) func create_user(name:Text): async Result.Result<Types.User, Types.Error> {
        Debug.print(debug_show(caller));
        return DB.create_user(caller, name);
    };

    // TODO: Delete everything around it for now
    public shared({caller}) func update_user(name:Text): async Result.Result<Types.User, Types.Error> {
        DB.Users.update_user(caller, name);
        switch(DB.Users.get_user(caller)){
            case (null){ return #err(#UserNotFound)};
            case (?user){ return #ok(user)};
        };
    };

    // ---- Profile ----
    // TODO: Delete everything around it for now
    public query func get_profile(user_id:Principal): async ?Types.Profile {
        DB.Users.get_profile(user_id);
    };

    // TODO: Delete everything around it for now
    public shared({caller}) func update_profile(avatar:Blob): async Result.Result<?Blob, Types.Error> {
        DB.Users.update_profile(caller, avatar);
        switch(DB.Users.get_profile(caller)){
            case (null){ return #err(#UserNotFound)};
            case (?user){ return #ok(user)};
        };
    };
    
    // TODO: Delete everything around it for now
    // TODO: Update user
    // check if user exists already
    // check that caller is user
    // check if blob, username or both should be replaced
    // return User probably
    // public func update_user();


    // ---------------- Invoice ----------------
    public shared ({caller}) func get_invoice(invoice_id: Nat) : async Result.Result<Types.Invoice, Types.Error>  {
         if(not (await callerIsController(caller))){
            return #err(#NotAllowed);
         } else {
            switch(DB.Invoices.get_invoice(invoice_id)){
                case (null){ return #err(#InvoiceNotFound)};
                case (?invoice){ return #ok(invoice)};
            };
        };
    }; 

    public shared ({caller}) func create_invoice(reward: Nat) : async Result.Result<Types.Invoice, Types.Error> {
        switch (DB.Users.get_user(caller)){
            case(null){
                return #err(#UserNotFound);
            };
            case(?user){
                if(reward < min_reward_) {
                    return #err(#BelowMinReward);
                } else {
                    DB.create_invoice(reward + fee_,  Principal.fromActor(this), caller);
                };
            };
        };
    };
    
    public func verify_invoice(id : Nat) : async Result.Result<Types.Invoice, Types.Error> {
        // 1) check if exists
        switch (DB.Invoices.get_invoice(id)) {
            case (null) { return #err(#InvoiceNotFound) };
            case (?invoice) {
                // 2) check if verified
                if (invoice.verifiedAtTime != null) {
                    return #err(#InvoiceAlreadyVerified);
                } else {
                    // 3) check if paid
                    let res = await ledger_canister_.account_balance({account = invoice.destination});
                    let balance = Nat64.toNat(res.e8s);
                    if (balance >= invoice.amount) {
                        let verifiedAtTime = Time.now();
                        let marketDefaultAccount = A.getAccountId(Nat64.fromNat(0), Principal.toText(Principal.fromActor(this)));
                        Debug.print("marketDefaultAccount: " # debug_show(marketDefaultAccount));
                        // 3.5) verify already to avoid async problems
                        let verifiedInvoice = DB.Invoices.verify_invoice(invoice);
                        // 4) attempt to do the transfer
                        let transferRes: LedgerTypes.TransferResult = await ledger_canister_.transfer({
                            memo = 0;
                            fee = {
                                e8s = 10000;
                            };
                            amount = {
                                e8s = Nat64.sub(Nat64.fromNat(balance), 10000);
                            };
                            from_subaccount = ?invoice.subAccount;
                            to = marketDefaultAccount;
                            created_at_time = null;
                        });
                        switch transferRes {
                            case (#Ok index) {
                                // 5) if success: return the verified invoice
                                return #ok(verifiedInvoice);
                            };
                            // 6) if failed: return error
                            case(#Err err){
                                // revert to unverified state if the transfer failed
                                ignore DB.Invoices.un_verify_invoice(verifiedInvoice);
                                return #err(#TransferError(err));
                            };        
                        };
                    // 7) if not paid return error
                    } else {
                        return #err(#InvoiceNotPaid)
                    };
                };
            };
        };
    };

    // ---------------- Ask Question ----------------
    public shared ({caller}) func ask_question (
        invoice_id: Nat,
        duration_minutes: Int32,
        title: Text,
        content: Text
    ) : async Result.Result<Types.Question, Types.Error> {
        switch (DB.Invoices.get_invoice(invoice_id)){

            case (null) { return #err(#InvoiceNotFound) };
            case (?invoice) {
                Debug.print("1");
                // buyer of invoice is caller && ensures user exists
                if (invoice.buyer_id != caller) {return #err(#NotAllowed)} 
                else {
                    Debug.print("2");
                    switch (await verify_invoice(invoice_id)) {
                        case(#err err) { return #err(#VerifyInvoiceError) };
                        case(#ok verifiedInvoice){
                            Debug.print("3");
                            if(invoice.question_id != null){ return #err(#NotAllowed) } 
                            else {
                                let now = Utils.time_minutes_now();
                                Debug.print("now " # debug_show(now) # debug_show(verifiedInvoice));
                                switch (DB.create_question(
                                    caller,
                                    invoice_id, 
                                    duration_minutes,
                                    title,
                                    content,
                                    Utils.nat_to_int32(verifiedInvoice.amount - fee_) 
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

    // ---------------- Answer Question ----------------
    public shared ({caller}) func answer_question(question_id: Text, content: Text): async Result.Result<Types.Answer, Types.Error> {
        // ----- time_trigger -----
        await update_open(question_id);
 
        // ----- action_trigger -----
        switch (DB.Users.get_user(caller)){
            case(null){ return #err(#UserNotFound) };
            case(?user){
                switch(DB.Questions.get_question(question_id)){
                    case(null){ return #err(#QuestionNotFound) };
                    case(?question){
                        if (question.author_id == user.id) { return #err(#NotAllowed) } 
                        else {
                            switch(question.status){
                                case(#OPEN){
                                    switch(DB.create_answer(user.id, question_id, content)){
                                        case(#err(error)){ return #err(error) };
                                        case(#ok(answer)){ return #ok(answer) };
                                    };
                                };
                                case(_){
                                    return #err(#WrongStatus) };
                            };
                        };            
                    };
                };
            };
        };      
    };

    // ---------------- Pick Answer ----------------
    public shared ({caller}) func pick_answer(question_id: Text, answer_id: Text) : async Result.Result<(), Types.Error> {
        // ----- time_trigger -----
        await update_pick_answer(question_id);
        
        // ----- action_trigger -----
        switch (DB.Users.get_user(caller)){
            case(null){ return #err(#UserNotFound) };
            case(?user){
                switch(DB.Questions.get_question(question_id)){
                    case(null){ return #err(#QuestionNotFound) };
                    case(?question){
                        if (question.author_id != caller) { return #err(#NotAllowed)} else {
                            switch(DB.Answers.get_answer(answer_id)){
                                case(null){ return #err(#AnswerNotFound)};
                                case(?answer){
                                    if(answer.question_id != question_id){ return #err(#NotAllowed) } 
                                    else {
                                        if (question.status != #PICKANSWER) { return #err(#WrongStatus) } 
                                        else {
                                            ignore DB.Questions.pickanswer_to_disputable(question, duration_disputable_, answer_id);
                                            return #ok();
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

    // ---------------- Trigger Dispute ----------------
    // TODO: is order of guards coherent?
    // TODO: maybe this should trap if the potentialWinner was never defined? -> rather replace with sensible types
    public shared ({caller}) func dispute(question_id: Text): async Result.Result<(), Types.Error> {
        // ----- time_trigger -----
        await update_disputable(question_id);

        // ----- action_trigger -----
        switch(DB.Questions.get_question(question_id)){
            case(null){ return #err(#QuestionNotFound) };
            case(?question){
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

    // ---------------- Arbitrate ----------------
    public shared ({caller}) func arbitrate (question_id: Text, finalWinner: Types.FinalWinner): async Result.Result<(), Types.Error> {
        // ----- action_trigger -----
        if (not (await callerIsController(caller))){ return #err(#NotAllowed) }
        else {
            switch(DB.Questions.get_question(question_id)){
                case(null){ return #err(#QuestionNotFound) };
                case(?question){
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
    
    // ---------------- Time Updates ----------------
    // TODO decide if I want to have return values from these functions or not
    // TODO: they should return a Result, would be way cleaner, then it's clear what happend for debugging
    public func update_open(question_id:Text) : async () {
        switch(DB.Questions.get_question(question_id)){
            case(null){ return };
            case(?question){
                if(question.status != #OPEN){ return } else {
                    if(Utils.time_minutes_now() > question.status_end_date){
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
        switch(DB.Questions.get_question(question_id)){
            case(null){ return };
            case(?question){
                if(question.status != #PICKANSWER){ return } else {
                    if(Utils.time_minutes_now() > question.status_end_date){
                        ignore DB.Questions.to_arbitration(question);
                    };
                };
            };
        };
    };
   
    public func update_disputable(question_id:Text) : async () {
        switch(DB.Questions.get_question(question_id)){
            case(null){ return };
            case(?question){
                if(question.status != #DISPUTABLE){ return } else {
                    if(Utils.time_minutes_now() > question.status_end_date){
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
    // TODO: return types
    public func update_payout(question_id:Text) : async Result.Result<Nat64, Types.Error> {
        func pay (question: Types.Question, id: Principal): async Result.Result<Nat64, Types.Error> {
            switch(await transfer(id, question.reward)){
                case(#ok block_height){ 
                    ignore DB.Questions.ongoing_to_close(question, block_height);
                    Debug.print("BLOCK HEIGHT: "# debug_show(block_height));
                    return #ok(block_height);
                };
                case(#err(error)){ 
                    ignore DB.Questions.ongoing_to_pay(question); 
                    Debug.print("PAYMENT ERROR: " # debug_show(error));
                    // TODO: better error
                    return #err(#Failed);
                };
            }
        };
        switch(DB.Questions.get_question(question_id)){
            case(null){ return #err(#QuestionNotFound) };
            case(?question){
                if(question.status != #PAYOUT(#PAY)){ return #err(#WrongStatus) } 
                else {
                    switch(question.finalWinner){
                        // we should always have a defined final winner here
                        case(null){Prelude.unreachable()};
                        case(?finalWinner){
                            switch(finalWinner){
                                case(#QUESTION){ 
                                    ignore DB.Questions.pay_to_ongoing(question);
                                    return await pay(question, question.author_id);
                                };
                                case(#ANSWER({answer_id})){ 
                                    switch(DB.Answers.get_answer(answer_id)){
                                        // should always be legitimate answer of question
                                        case(null){ Prelude.unreachable() };
                                        case(?answer){ 
                                            ignore DB.Questions.pay_to_ongoing(question);
                                            return await pay(question, answer.author_id);
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

    // ---------------- Transfer ----------------
    private func transfer(to: Principal, amount: Int32) : async Result.Result<Nat64, Types.Error> {
        let recipientDefaultAccount = A.getDefaultAccountId(to);
        let transferRes: LedgerTypes.TransferResult = await ledger_canister_.transfer({
            memo = 0;
            fee = {
                e8s = 10000;
            };
            amount = {
                e8s = Nat64.sub(Nat64.fromNat(Nat32.toNat(Int32.toNat32(amount))), 10000);
            };
            from_subaccount = null;
            to=recipientDefaultAccount;
            created_at_time = null;
        });   
        switch(transferRes){
            case(#Err err){return #err(#TransferError(err))};
            case(#Ok index){ return #ok(index) };
        };           
    }; 

    public func update_status () : async () {
            // this is rather inefficient as I get the questions only to pass the ids to get them again
            // in the time functions. Benefit is that I can check the status.
            let questions: [Types.Question] = DB.Questions.get_unclosed_questions();
            label l for (question in Iter.fromArray<Types.Question>(questions)) {
                switch(question.status){
                    case(#OPEN){
                        await update_open(question.id);
                    };
                    case(#PICKANSWER){ 
                        await update_pick_answer(question.id);
                    };
                    case(#DISPUTABLE){ 
                        await update_disputable(question.id);
                    };
                    case(#PAYOUT(#PAY)){  
                        Debug.print(debug_show(await update_payout(question.id)));
                    };
                    case(_){ continue l };
                };
            };
      
    };

    // ---------------- Timer ----------------
    // Intuition: Timer simply simulates a user. All the functions it calls are public.
    let timer_id = Prim.setTimer(5000000000:Nat64, true, func(): async() {
        await update_status();
    }); 
};