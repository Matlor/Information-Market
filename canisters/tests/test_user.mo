import Types "../market/types";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import Result "mo:base/Result";

// TODO: if the interface change the changes are not reflected in the imported motoko
import InvoiceTypes "../invoice/types";
import LedgerTypes "../invoice/ledgerTypes2";

shared (deployer) actor class test_user(market_canister: Types.Interface, ledger_canister: LedgerTypes.Interface): async (Types.Interface or LedgerTypes.Interface)  = this  {

    public shared func who_am_i() : async () {
        return await market_canister.who_am_i();
    };

    public shared func get_coin_symbol() : async Text {
        return await market_canister.get_coin_symbol();
    };

    public shared func get_min_reward() : async Nat {
        return await market_canister.get_min_reward();
    };

    public shared func get_fee() : async Nat {
        return await market_canister.get_fee();
    };

    public shared func get_duration_pick_answer() : async Int32 {
        return await market_canister.get_duration_pick_answer();
    };

    public shared func get_duration_disputable() : async Int32 {
        return await market_canister.get_duration_disputable();
    };

    public shared func get_update_status_on_heartbeat() : async Bool {
        return await market_canister.get_update_status_on_heartbeat();
    };

    public shared({caller}) func update_market_params(params: Types.UpdateMarketParams) : async Result.Result<(), Types.StateError>{
        return await market_canister.update_market_params(params: Types.UpdateMarketParams);
    };

    public shared({caller}) func set_db(initial_state:Types.State): async Types.State {
        return await market_canister.set_db(initial_state:Types.State);
    };
    
    public shared({caller}) func get_db(): async Types.State {
        return await market_canister.get_db();
    };

    public shared({caller}) func create_user(name:Text): async Result.Result<Types.User, Types.StateError> {
        return await market_canister.create_user(name:Text);
    };

    public func get_user(user_id:Principal): async ?Types.User {
        return await market_canister.get_user(user_id:Principal);
    };

    public shared ({caller}) func create_invoice(reward: Nat) : async InvoiceTypes.CreateInvoiceResult  {
        return await market_canister.create_invoice(reward: Nat);
    };

    public shared ({caller}) func ask_question (
        invoice_id: Nat,
        duration_minutes: Nat,
        title: Text,
        content: Text
    ) : async Result.Result<Types.Question, Types.StateError> {
        return await market_canister.ask_question(invoice_id: Nat, duration_minutes: Nat, title: Text,content: Text);
    };

    public shared ({caller}) func answer_question(question_id: Text, content: Text): async Result.Result<Types.Answer, Types.StateError> {
        return await market_canister.answer_question(question_id: Text, content: Text);
    };

    public shared ({caller}) func pick_answer(question_id: Text, answer_id: Text) : async Result.Result<(), Types.StateError> {
        return await market_canister.pick_answer(question_id: Text, answer_id: Text);
    };

    public shared ({caller}) func dispute (question_id: Text): async Result.Result<(), Types.StateError> {
        return await market_canister.dispute (question_id: Text);
    };

    public shared ({caller}) func arbitrate (question_id: Text, finalWinner: Types.FinalWinner): async Result.Result<(), Types.StateError> {
        return await market_canister.arbitrate(question_id: Text, finalWinner: Types.FinalWinner);
    }; 
    
    public func update_open(question_id:Text) : async () {
        return await market_canister.update_open(question_id:Text); 
    };

    public func update_pick_answer(question_id:Text) : async () {
        return await market_canister.update_pick_answer(question_id:Text);
    };
   
    public func update_disputable(question_id:Text) : async () {
        return await market_canister.update_disputable(question_id:Text);
    };

    public func update_payout(question_id:Text) : async Result.Result<Nat64, Types.StateError> {
        return await market_canister.update_payout(question_id:Text); 
    };

    // TODO: DELETE
    public func exp() : async Text {
        return await market_canister.exp(); 
    };


    // ---------------------- Ledger ----------------------
    public func transfer(args:LedgerTypes.TransferArgs) : async LedgerTypes.TransferResult {
        await ledger_canister.transfer(args:LedgerTypes.TransferArgs);
    };

    public func account_balance(args:LedgerTypes.AccountBalanceArgs) : async LedgerTypes.Tokens {
        await ledger_canister.account_balance(args:LedgerTypes.AccountBalanceArgs);
    };

    public func query_blocks(arg: LedgerTypes.GetBlocksArgs) : async LedgerTypes.QueryBlocksResponse {
        await ledger_canister.query_blocks(arg: LedgerTypes.GetBlocksArgs);
    };
};