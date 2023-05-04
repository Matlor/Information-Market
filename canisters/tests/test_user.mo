import Interface "../market/Interface";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import Result "mo:base/Result";

// TODO: if the interface change the changes are not reflected in the imported motoko
import LedgerTypes  "../ledger/ledgerTypes2";

shared (deployer) actor class test_user(market_canister: Interface.Market, ledger_canister: LedgerTypes.Interface): async (Interface.Market or LedgerTypes.Interface)  = this  {

    public shared func get_min_reward() : async Nat32 {
        return await market_canister.get_min_reward();
    };

    public shared func get_fee() : async Nat32 {
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

    public shared({caller}) func update_market_params(params: Interface.UpdateMarketParams) : async Result.Result<(), Interface.Error>{
        return await market_canister.update_market_params(params: Interface.UpdateMarketParams);
    };

    public shared({caller}) func set_db(initial_state:Interface.State): async Result.Result<Interface.State, Interface.Error> {
        return await market_canister.set_db(initial_state:Interface.State);
    };
    
    public shared({caller}) func get_db(): async Result.Result<Interface.State, Interface.Error> {
        return await market_canister.get_db();
    };

    public shared({caller}) func create_user(): async Result.Result<Interface.User, Interface.Error> {
        return await market_canister.create_user();
    };

    public func get_user(user_id:Principal): async ?Interface.User {
        return await market_canister.get_user(user_id:Principal);
    };

    public shared ({caller}) func create_invoice(reward: Nat32) : async Result.Result<Interface.Invoice, Interface.Error>  {
        return await market_canister.create_invoice(reward: Nat32);
    };

    public shared ({caller}) func ask_question (
        invoice_id: Nat32,
        duration_minutes: Int32,
        title: Text,
        content: Text
    ) : async Result.Result<Interface.Question, Interface.Error> {
        return await market_canister.ask_question(invoice_id: Nat32, duration_minutes: Int32, title: Text,content: Text);
    };

    public shared ({caller}) func answer_question(question_id: Nat32, content: Text): async Result.Result<Interface.Answer, Interface.Error> {
        return await market_canister.answer_question(question_id: Nat32, content: Text);
    };

    public shared ({caller}) func pick_answer(question_id: Nat32, answer_id: Nat32) : async Result.Result<(), Interface.Error> {
        return await market_canister.pick_answer(question_id: Nat32, answer_id: Nat32);
    };

    public shared ({caller}) func dispute (question_id: Nat32): async Result.Result<(), Interface.Error> {
        return await market_canister.dispute (question_id: Nat32);
    };

    public shared ({caller}) func arbitrate (question_id: Nat32, finalWinner: Interface.FinalWinner): async Result.Result<(), Interface.Error> {
        return await market_canister.arbitrate(question_id: Nat32, finalWinner: Interface.FinalWinner);
    }; 
    
    public func update_open(question_id:Nat32) : async () {
        return await market_canister.update_open(question_id:Nat32); 
    };

    public func update_pick_answer(question_id:Nat32) : async () {
        return await market_canister.update_pick_answer(question_id:Nat32);
    };
   
    public func update_disputable(question_id:Nat32) : async () {
        return await market_canister.update_disputable(question_id:Nat32);
    };

    public func update_payout(question_id:Nat32) : async Result.Result<Nat64, Interface.Error> {
        return await market_canister.update_payout(question_id:Nat32); 
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