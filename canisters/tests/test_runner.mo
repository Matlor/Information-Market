import Iter         "mo:base/Iter";
import Time         "mo:base/Time";
import Array        "mo:base/Array";
import Blob         "mo:base/Blob";
import Buffer       "mo:base/Buffer";
import Int32        "mo:base/Int32";
import Nat          "mo:base/Nat";
import Bool         "mo:base/Bool";
import C            "mo:matchers/Canister";
import M            "mo:matchers/Matchers";
import T            "mo:matchers/Testable";
import S            "mo:matchers/Suite";
import Principal    "mo:base/Principal";
import Debug        "mo:base/Debug";
import Result       "mo:base/Result";
import MarketTypes  "../market/types";
import Test_User    "./test_user";
import Hex          "../invoice/Hex";

// TODO: improve these imports
import Account          "../market/ledger/accounts";
import LedgerTypes      "../invoice/ledgerTypes";
import LedgerTypes2      "../invoice/ledgerTypes2";

import InvoiceTypes     "../invoice/types";

import Prelude          "mo:base/Prelude";
import Nat64            "mo:base/Nat64";


shared ({ caller = admin }) actor class test_runner(market:Principal, ledger:Principal, invoice:Principal) = this {
    // TODO: generally check that the state I set is as long as what I define, because if I add the same question id it will just overwrite the value there
    // TODO: check that only one answer is related to one question and so on. The setState should check for these things possibly?

    // for convenience
    type Question = MarketTypes.Question;
    type User = MarketTypes.User;
    type Invoice = MarketTypes.Invoice;
    type Answer = MarketTypes.Answer;
    type FinalWinner = MarketTypes.FinalWinner;
    type State = MarketTypes.State;

    let market_canister : MarketTypes.Interface = actor(Principal.toText(market));
    let ledger_canister : LedgerTypes2.Interface = actor(Principal.toText(ledger));

    // ----------------------- HELPERS -----------------------
    // TODO: Everything can ultimately run in the test function I suppose
    // that would get around the limitation that I can only run async stuff in a function


    // ---------------------- Ledger Helpers ----------------------
    // DELETE
    public func def_acc_delete(): async Blob {
        getDefaultAccount(invoice, market);
    };

    // TODO: rename not that it gets confused
    func getDefaultAccount(invoice:Principal, market:Principal):  Blob {
        Account.accountIdentifier(invoice, Account.principalToSubaccount(market));
    };

    var known_accounts: Buffer.Buffer<{name: Text; account: Text}> = Buffer.Buffer<{name: Text; account: Text}>(10);

    func get_known_addresses () : [{name:Text; account:Text}] {
        let test_runner_principal: Principal = Principal.fromActor(this);
        let market_: Principal = market;
        
        let test_runner_account_id: Blob = Account.accountIdentifier(test_runner_principal, Account.defaultSubaccount());
        let market_bank_account: Blob = getDefaultAccount(invoice, market_);
        
        known_accounts.add( {name = "test_runner_account"; account = Hex.encode(Blob.toArray(test_runner_account_id))});
        known_accounts.add( {name = "market_bank_account"; account = Hex.encode(Blob.toArray(market_bank_account))});
   
        return Buffer.toArray(known_accounts);
    };

    public func add_known_address (name:Text, account: Text) : () {
        let iter: Iter.Iter<{name: Text; account: Text}> = Iter.fromArray<{name: Text; account: Text}>(get_known_addresses());
        label l for (item in iter) {
            if(item.account == account){return};
        };
        known_accounts.add( {name=name; account} );
    };

    var user_counter: Nat = 0;  
    public func create_test_user() : async Test_User.test_user {
        let user = await Test_User.test_user(market_canister, ledger_canister);
        add_known_address(Nat.toText(user_counter), Hex.encode(Blob.toArray(Account.accountIdentifier(Principal.fromActor(user), Account.defaultSubaccount()))));
        user_counter += 1;
        return user;
    };

    public shared func ledger_state(initial_block_: ?Nat64) : async (Nat, [{name: Text; account: Text; balance: Nat64}]) {
        let initial_block:Nat64 = 0;
        //switch(initial_block_){case(null){0}; case(?value){value};};
        
        //(await ledger_canister.query_blocks({ start = 0:Nat64; length = 1:Nat64; })).chain_length;

        let a_user = await create_test_user();
        let b_user = await create_test_user();

       /*  // sample transactions
        await exp(Principal.fromActor(a_user));
        await exp(Principal.fromActor(a_user));
        await exp(Principal.fromActor(b_user));*/

        let currentBlock:Nat64 = (await ledger_canister.query_blocks({ start = 0:Nat64; length = 1:Nat64; })).chain_length;
        let length:Nat64 = currentBlock - initial_block;
        let res:LedgerTypes2.QueryBlocksResponse = await ledger_canister.query_blocks({ start = initial_block; length; });
        let blocks: [LedgerTypes2.Block] = res.blocks;

        var addresses: Buffer.Buffer<Blob> = Buffer.Buffer<Blob>(10);
        addresses.add(Account.accountIdentifier(Principal.fromActor(this), Account.defaultSubaccount()));

        // TODO:
        var transaction_counter: Nat = 0;

        // iterate through all of these transactions
        let blocks_iter: Iter.Iter<LedgerTypes2.Block> = Iter.fromArray<LedgerTypes2.Block>(blocks);
        label l for (block in blocks_iter) {
            switch(block.transaction.operation){
                case(null){};
                case(?operation){
                    switch(operation){
                        case(#Transfer(transfer)){
                            var fromIsIncluded: Bool = false;
                            var toIsIncluded:Bool = false;
                            for(address in addresses.vals()){
                                if(address == transfer.from){
                                    fromIsIncluded := true;
                                };
                                if(address == transfer.to){
                                    toIsIncluded := true;
                                };
                            };

                            if(fromIsIncluded and toIsIncluded){ 
                                transaction_counter += 1;
                                continue l
                            } else if(not fromIsIncluded and not toIsIncluded){continue l} 
                            else if(fromIsIncluded and not toIsIncluded){
                                transaction_counter += 1;
                                addresses.add(transfer.to);
                                continue l;
                            } else if(not fromIsIncluded and toIsIncluded){
                                addresses.add(transfer.from);
                                continue l;
                            };
                        };
                        case(_){};
                    };
                };
            };
        };

        var accounts: Buffer.Buffer<{name: Text; account: Text; balance: Nat64}> = Buffer.Buffer<{name: Text; account: Text; balance: Nat64}>(10);

        // Major limitation: we cannot go from account id to principal
        for(address in addresses.vals()){
            let arr = get_known_addresses();
            let iter: Iter.Iter<{name: Text; account: Text}> = Iter.fromArray<{name: Text; account: Text}>(get_known_addresses());
            
            // TODO: this balance can't be correct, I can't fetch past balances!
            var textAddress = {name= ""; account = Hex.encode(Blob.toArray(address)); balance= (await ledger_canister.account_balance({ account=address })).e8s };
            label inner for (item in iter) {
                if(textAddress.account == item.account){
                    textAddress :=  {name= item.name; account = textAddress.account; balance= textAddress.balance};
                } else { continue inner };
            };
            accounts.add(textAddress);
        };
        (transaction_counter, Buffer.toArray(accounts));
    };


    public shared func fund_principal(principal:Principal) : async LedgerTypes2.TransferResult { 
        Debug.print(debug_show(principal));  
        let transfer_res: LedgerTypes2.TransferResult = await ledger_canister.transfer({ 
                memo = 42:Nat64;
                amount = { e8s = 2_000_000_000 };
                fee = { e8s = 10_000 };
                from_subaccount = null;
                to = Account.accountIdentifier(principal, Account.defaultSubaccount());
                created_at_time = null;
            }
        );
    };

    public shared func fund_account_on_invoice( ) : async LedgerTypes2.TransferResult { 
        Debug.print(debug_show(getDefaultAccount(invoice, market)));
        let transfer_res: LedgerTypes2.TransferResult = await ledger_canister.transfer({ 
                memo = 42:Nat64;
                amount = { e8s = 2_000_000_000 };
                fee = { e8s = 10_000 };
                from_subaccount = null;
                to = getDefaultAccount(invoice, market);
                created_at_time = null;
            }
        );
    };

    // ---------------------- State Helpers ----------------------
    // TODO: a function that find which values in the state have changed.

    func array_length<T>(arr: [T]): Nat {
        let iter: Iter.Iter<T> = Iter.fromArray<T>(arr);
        Iter.size<T>(iter);
    };

    func set_empty_state(): async () {
        ignore await market_canister.set_db({
            answers_state = [];
            invoices_state = [];
            questions_state = [];
            users_state = [];
        }: State);
    };

    // --------------------------------- TESTS ----------------------------------
    // TODO: should I only ever interact with the canister from the test_user canisters?
    // TODO: this test_runner should probably deploy the canister as I can then mess with the min_reward and other settings. (or I set them)
    // TODO: I could even tests if upgrades work maybe? Is that possible?
    public shared func test() : async Text {
        let suite = S.suite("test", [
            S.test("testUserManagement", switch( await testUserManagement()){case( #success ){true};case(_){ false };}, M.equals<Bool>(T.bool(true))),   
            S.test("testCreateInvoice", switch( await testCreateInvoice()){ case( #success ){true};case(_){ false };}, M.equals<Bool>(T.bool(true))),   
            S.test("testCreateInvoice", switch( await testPayingInvoice()){ case( #success ){true};case(_){ false };}, M.equals<Bool>(T.bool(true))),   
        ]);
        S.run(suite);
        return "Success";
    };

    // TODO: Test against state instead of return values
    public shared func testUserManagement() : async {#success; #fail : Text} {

        Debug.print("running testUserManagement");
        ignore  await market_canister.set_db({
            answers_state = [];
            invoices_state = [];
            questions_state = [];
            users_state = [];
        }: State);

        let a_user = await Test_User.test_user(market_canister, ledger_canister);
        let b_user = await Test_User.test_user(market_canister, ledger_canister);

        let res_first_user: Result.Result<User, MarketTypes.StateError> = await a_user.create_user("John");
        let first_user_expectation: User =  {
            id = Principal.fromText("rdmx6-jaaaa-aaaaa-aaadq-cai") ; 
            answers = []; 
            avatar = null; 
            invoices = []; 
            joined_date = +27_848_921; 
            name = "John"; 
            questions = []
        };

        let res_second_user: Result.Result<User, MarketTypes.StateError> = await market_canister.create_user("John");

        let res_third_user: Result.Result<User, MarketTypes.StateError> = await b_user.create_user("Tim");
        let third_user_expectation: User =  {
            id = Principal.fromActor(b_user); 
            answers = []; 
            avatar = null; 
            invoices = []; 
            joined_date = +27_848_921; 
            name = "Tim"; 
            questions = []
        };
       
        let suite = S.suite("user management", [
            S.test(
                "should create a user", 
                switch(res_first_user){
                    case(#ok(user)){
                        // ignoring joined_date
                        if( user.id == first_user_expectation.id and
                            user.answers == first_user_expectation.answers and
                            user.invoices == first_user_expectation.invoices and
                            user.name == first_user_expectation.name and
                            user.questions == first_user_expectation.questions  
                        ){ "success" } else { "error" };
                    };
                    case(#err(err)){"unexpected error"};
                },  
                M.equals<Text>(T.text("success"))
            ),

            S.test(
                "should fail to create the same user again",
                switch(res_second_user){
                    case(#ok(user)){ "user created again" };
                    case(#err(err)){
                        Debug.print(debug_show(err));
                        if(err == #UserIsInvalid) {"UserIsInvalid"} else {"unexpected error"};
                    };
                },
                M.equals<Text>(T.text("UserIsInvalid"))
            ),

            S.test(
                "should create another user from a different principal",
                switch(res_third_user){ 
                     case(#ok(user)){
                        // ignoring joined_date
                        if( user.id == third_user_expectation.id and
                            user.answers == third_user_expectation.answers and
                            user.invoices == third_user_expectation.invoices and
                            user.name == third_user_expectation.name and
                            user.questions == third_user_expectation.questions 
                        ){ "success" } else { "error" };
                    };
                    case(#err(err)){"unexpected error"};
                },
                M.equals<Text>(T.text("success")),
            ),           
        ]);

        // TODO: testing if state has correct structure
        // TODO: testing blob and user update
        // TODO: testing anonymous caller -> not possible
        // TODO: testing if unique user name is enforced
        S.run(suite);
        return #success;
    };
   
    public shared func testCreateInvoice() : async {#success; #fail : Text} {
        Debug.print("running testCreateInvoice");
        let a_user = await Test_User.test_user(market_canister, ledger_canister);

        ignore await market_canister.set_db({
            answers_state = [];
            invoices_state = [];
            questions_state = [];
            users_state = [
                {
                    id = Principal.fromActor(a_user); 
                    answers = []; 
                    avatar = null; 
                    invoices = []; 
                    joined_date = Int32.fromInt(Time.now() / 60000000000);
                    name = "John"; 
                    questions = []
                },
            ];
        }: State);

        let prior_state: State = await market_canister.get_db();
        Debug.print("get_db: " # debug_show(prior_state));

        // TODO: try to get the invoice from the invoice canister
        // TODO: sequential would be much nicer. Have a scenario and then an assertion.

        let first_res = await a_user.create_invoice((await a_user.get_min_reward()) - 1);
        let state = await market_canister.get_db();

        let second_res = await a_user.create_invoice((await a_user.get_min_reward()) + 1 );
        let state_res = await market_canister.get_db();

        let suite = S.suite("test create invoice", [
            // TODO: might not work if 0
            S.test("should fail if reward < min-reward", switch(first_res){
                    case(#ok(success)){ Debug.print("" # debug_show(success.invoice)); "success" };
                    // TODO: use specific error:
                    case(#err(err)){ 
                        if(state == prior_state){
                            "expected error";
                        } else {
                            "unexpected outcome"
                        };
                    };
                },
                M.equals<Text>(T.text("expected error"))
            ),
            S.test(
                "should work if reward > min-reward",
                switch(second_res){
                    case(#ok(success)){ "success" };
                    // TODO: use specific error:
                    case(#err(err)){ "error" };
                },
                M.equals<Text>(T.text("success")),
            ),
            S.test(
                "state should contain the invoice",
                switch(state_res){
                    case({invoices_state}){ 
                        if( 
                            array_length<Invoice>(invoices_state) == 1 and
                            invoices_state[0].buyer_id == Principal.fromActor(a_user) and 
                            invoices_state[0].question_id == null
                        ){ "success" } else { "error" };
                    };
                }      
                ,
                M.equals<Text>(T.text("success")),
            ),
            
        ]);
        S.run(suite);
        return #success;
    }; 

    // TODO: a func that ignores the bad case
    /* func ignore_case<T>(result: Result.Result<T, ()>): T {
        switch(result){
            case(#ok(val)) { return ok };
            case(#err(err)) { Prelude.unreachable() };
        };
    };  */

    // TODO: replace this, extremely unsafe!
    func fromText(accountId : Text) : Blob {
        switch (Hex.decode(accountId)) {
            case(#ok v){ let blob = Blob.fromArray(v);
            };
            case(_){Prelude.unreachable()};
        };
    };

    public shared func testPayingInvoice() : async {#success; #fail : Text} {
        // ----- Setup -----
        // set state to: 
        // have a user -> I'd need to add the specific principal as a user to the state
        // have an invoice
        // fund the user -> how? I need a minter. Can the minter be the deployer? Call the ledger, which ledger? import the ledger and so on. 
        // pay the invoice -> maybe get the invoice? call the ledger 
        // state of the invoice/ledger -> can I log them somehow? Could my "get_db" func contain queries to them?
        // visualise what is happening here exactly

        // should verify invoice be a public func? then I could test that step separately?
        // here I need a logger what happens when exactly. Here it gets interesting with the actor model.
        // ------------

        // add:
        // refering to invoice that does not exist
        // could invoice be created on IC but not locally?
        

        // 1. the test_runner should be funded automatically when I deploy it. Then I can assume it to be funded -> DONE
        // 2. create a user & add to the db -> DONE
        // 2.5 create_invoice -> problem I'd like to simulate that directly -> or I just call the function!  -> put it into a function
        // 3. user calls "create_question" -> should fail
        // 4. user calls create_question -> fails / no state change
        // 5. user calls ledger to transfer some amount -> should work
        // 6. user calls create_question -> fails / no state change
        // 7. user calls ledger and pays the rest -> should work
        // 8. user calls create_question -> should work
        // 9. invoice can't be used twice
        // 10. state is correct (invoice containing q etc.)

        Debug.print("running testPayingInvoice");

        let a_user = await Test_User.test_user(market_canister, ledger_canister);
        let a_user_account = Account.accountIdentifier(Principal.fromActor(a_user), Account.defaultSubaccount());
        Debug.print("ledger transfer: " # debug_show(await ledger_canister.transfer({ 
                amount = { e8s = 2_000_000_000 };
                created_at_time = null;
                fee = { e8s = 10_000 };
                from_subaccount = null;
                memo = 42;
                to = a_user_account;
            }
        )));

        ignore await market_canister.set_db({
            answers_state = [];
            invoices_state = [];
            questions_state = [];
            users_state = [{
                id = Principal.fromActor(a_user); 
                answers = []; 
                avatar = null; 
                invoices = []; 
                joined_date = Int32.fromInt(Time.now() / 60000000000);
                name = "John"; 
                questions = []
            }];
        }: State);

        let ask_unknown_invoice = await a_user.ask_question(100, 2, "test question", "Predictable state updates: Reducer functions are pure, meaning they don't have side effects and only depend on their input arguments. This makes state updates more predictable and easier to reason about. You can easily understand how the state will change based on the dispatched action without worrying about unintended consequences.");


        let amount: Nat = await a_user.get_min_reward();
        let invoice: InvoiceTypes.Invoice = switch(await a_user.create_invoice(amount)){ 
            case(#ok(success)){ success.invoice };
            case(_){ 
            Debug.print("create_invoice failed");
            Prelude.unreachable() 
        }};
        let invoic_account_blob: Blob = switch(invoice.destination){ case(#text(account_id_text)){ fromText(account_id_text) }; case(_){
            Debug.print("invoic_account_blob failed");
            Prelude.unreachable()}  
        }; 

        let ask_unpaid_invoice = await a_user.ask_question(100, 2, "test question", "Predictable state updates: Reducer functions are pure, meaning they don't have side effects and only depend on their input arguments. This makes state updates more predictable and easier to reason about. You can easily understand how the state will change based on the dispatched action without worrying about unintended consequences.");
        let ledger_state_0 = await ledger_state(null);
        Debug.print("ledger_state_0:     " # debug_show(ledger_state_0));

        let transfer_state_1 =  await a_user.transfer({ 
            amount = { e8s = (Nat64.fromNat(invoice.amount) - 50_000)};
            created_at_time = null;
            fee = { e8s = 10_000 };
            from_subaccount = null;
            memo = 42;
            to = invoic_account_blob;
        });
        let ask_underpaid_invoice = await a_user.ask_question(100, 2, "test question", "Predictable state updates: Reducer functions are pure, meaning they don't have side effects and only depend on their input arguments. This makes state updates more predictable and easier to reason about. You can easily understand how the state will change based on the dispatched action without worrying about unintended consequences.");
        let ledger_state_1 = await ledger_state(null);
        // switch(transfer_state_1){case(#Ok(val)){?val}; case(_){Prelude.unreachable()}}
        Debug.print("ledger_state_1:     " # debug_show(ledger_state_1));

        let transfer_state_2 = await a_user.transfer({ 
            amount = { e8s = Nat64.fromNat(50_000)};
            created_at_time = null;
            fee = { e8s = 10_000 };
            from_subaccount = null;
            memo = 42;
            to = invoic_account_blob;
        });
        let ask_paid_invoice =  await a_user.ask_question(invoice.id, 2, "test question", "Predictable state updates: Reducer functions are pure, meaning they don't have side effects and only depend on their input arguments. This makes state updates more predictable and easier to reason about. You can easily understand how the state will change based on the dispatched action without worrying about unintended consequences.");
        let ledger_state_2 = await ledger_state(null);
        Debug.print("ledger_state_2:     " # debug_show(ledger_state_2));


        let ask_again_invoice =  await a_user.ask_question(invoice.id, 2, "test question", "Predictable state updates: Reducer functions are pure, meaning they don't have side effects and only depend on their input arguments. This makes state updates more predictable and easier to reason about. You can easily understand how the state will change based on the dispatched action without worrying about unintended consequences.");
        let ledger_state_3 = await ledger_state(null);



        let suite = S.suite("test paying invoice", [
            S.test(
                "unknown invoice should not be usable to ask a question",
                switch(ask_unknown_invoice){
                    case(#err(err)){ "expected error" };
                    case(#ok(res)){ "unexpected" };
                },
                M.equals<Text>(T.text("expected error"))
            ),
            S.test(
                "unpaid invoice should not be usable to ask a question",
                switch(ask_unpaid_invoice){
                    case(#err(_)){ 
                        if(
                            ledger_state_0.0 == 1 and
                            array_length(ledger_state_0.1) == 2 and
                            ledger_state_0.1[0].name == "test_runner_account"
                        ){"expected error" } else {
                            "unexpected state"
                        };
                    };
                    case(#ok(res)){ "unexpected success" };
                },
                M.equals<Text>(T.text("expected error"))
            ),
            S.test(
                "underpaid invoive should not be usable to ask a question",
                switch(ask_underpaid_invoice){
                    case(#err(_)){ 
                         if(
                            ledger_state_1.0 == 2 and
                            array_length(ledger_state_1.1) == 3 
                        ){"expected error" } else {
                            "unexpected state"
                        };
                    };
                    
                    case(#ok(res)){"unexpected success"};
                },
                M.equals<Text>(T.text("expected error"))
            ),
            S.test(
                "paid invoice should be usable to ask a question",
                switch(ask_paid_invoice){
                    case(#err(_)){ "unexpected" };
                    case(#ok(res)){
                        if(
                            ledger_state_2.0 == 4 and
                            array_length(ledger_state_2.1) == 4 
                        ){"success" } else {
                            "unexpected state"
                        };
                    };
                },
                M.equals<Text>(T.text("success"))
            ),
            S.test(
                "using the same invoice twice shall not work",
                switch(ask_again_invoice){
                    case(#ok(res)){ "unexpected" };
                    case(#err(_)){
                        if(
                            ledger_state_3.0 == 4 and
                            array_length(ledger_state_3.1) == 4 
                        ){"expected error" } else {
                            "unexpected state"
                        };
                    };
                },
                M.equals<Text>(T.text("expected error"))
            ),
          // Check what else we did with ic-repl
        ]);
        S.run(suite);
        return #success;
    };

    // ---------------------- TIME BASED FUNCTIONS ----------------------

    // TODO: I need a "change state function, that allows me to only change one thing"
    // TODO: I need to define somewhere all the basic states that should work or not. Here it will get complicated

    // --------- answer_question ---------
    // think of all cases that should not allow a questio to occur
    // then test that it works
    // then test update func
    
    // I HAVE TO GET DONE TODAY!
    
    public shared func testAnsweringQuestion() : async {#success; #fail : Text} {
        // TODO: ananymous users 
        // TODO: status update tests for minutes
        // TODO: test update_open directly (I have to!)
        // TODO: does it transition to correct thing if it has answers
        // TODO: does it transition to correct thing if it has no answers
        // TODO: if the status transitions as time is up, check that the subsequent func execution runs into status condition
        // TODO: check well that the status changes works perfectly (with the ids!)
        // TODO: length of the update call should be limited
        // TODO: test creation_date
        // TODO: I have to get the counters as state as well! everything has to be in one clear DB 
        // this always includes checking the balances
        // -----------------------------------------------
        Debug.print("running testAnsweringQuestion");
        ignore await market_canister.set_db({
            answers_state = [];
            invoices_state = [];
            questions_state = [];
            users_state = [];
        }: State);

        let a_user: Test_User.test_user = await  create_test_user();

        let answer_no_user = await a_user.answer_question("0", "Integration with popular libraries: Reducer pattern is popularized by libraries like Redux, which provide additional benefits such as middleware support, devtools integration, and the ability to manage your application's entire state in a single store. This further enhances the advantages of the reducer pattern.");

        ignore await market_canister.set_db({
            answers_state = [];
            invoices_state = [];
            questions_state = [];
            users_state = [{
                id = Principal.fromActor(a_user); 
                answers = []; 
                avatar = null; 
                invoices = []; 
                joined_date:Int32 = Int32.fromInt(Time.now() / 60000000000);
                name = "John"; 
                questions = []
            }];
        }: State);
        let answer_no_question = await a_user.answer_question("0", "Integration with popular libraries: Reducer pattern is popularized by libraries like Redux, which provide additional benefits such as middleware support, devtools integration, and the ability to manage your application's entire state in a single store. This further enhances the advantages of the reducer pattern.");

        var single_question_no_answer = {
            answers_state = [];
            invoices_state = [{
                id = 0;
                buyer_id = Principal.fromActor(a_user);
                question_id = ?"0";
            }];
            questions_state = [{
                id= "0";
                author_id= Principal.fromActor(a_user);
                invoice_id= 0; 
                creation_date :Int32 = Int32.fromInt(Time.now() / 60000000000) +1;
                status= #OPEN;
                status_update_date:Int32 = Int32.fromInt(Time.now() / 60000000000)+1;
                status_end_date:Int32 = Int32.fromInt(Time.now() / 60000000000)+2;
                open_duration :Int32 = 2;
                title = "test question";
                content = "Predictable state updates: Reducer functions are pure, meaning they don't have side effects and only depend on their input arguments. This makes state updates more predictable and easier to reason about. You can easily understand how the state will change based on the dispatched action without worrying about unintended consequences.";
                reward:Int32 = 1_300_000:Int32;
                potentialWinner = null;
                finalWinner = null;
                close_transaction_block_height= null;
                answers = []; // relation to answer
            }];
            users_state = [{
                id = Principal.fromActor(a_user); 
                answers = []; 
                avatar = null; 
                invoices = []; 
                joined_date:Int32 = Int32.fromInt(Time.now() / 60000000000);
                name = "John"; 
                questions = []
            }];
        };
       
        Debug.print(debug_show(await market_canister.set_db(single_question_no_answer: State)));
        let answer_is_author = await a_user.answer_question("0", "Integration with popular libraries: Reducer pattern is popularized by libraries like Redux, which provide additional benefits such as middleware support, devtools integration, and the ability to manage your application's entire state in a single store. This further enhances the advantages of the reducer pattern.");

        // add user to state
        let b_user: Test_User.test_user = await create_test_user();
        let new_users_state = [
            single_question_no_answer.users_state[0],
            {
                id = Principal.fromActor(b_user); 
                answers = []; 
                avatar = null; 
                invoices = []; 
                joined_date:Int32 = Int32.fromInt(Time.now() / 60000000000);
                name = "Tim"; 
                questions = []
            }
        ];
        let state_two_users = {
            single_question_no_answer with users_state = new_users_state;
        };

        Debug.print(debug_show(await market_canister.set_db(state_two_users: State)));

        /* let new_question_open: MarketTypes.Question = {single_question_no_answer.questions_state[0] with status = #OPEN};
        let new_question_pickanswer: MarketTypes.Question = {single_question_no_answer.questions_state[0] with status = #PICKANSWER};
        let new_question_disputable: MarketTypes.Question = {single_question_no_answer.questions_state[0] with status = #DISPUTABLE};
        let new_question_arbitration: MarketTypes.Question = {single_question_no_answer.questions_state[0] with status = #ARBITRATION};
        let new_question_payout_pay: MarketTypes.Question = {single_question_no_answer.questions_state[0] with status = #PAYOUT(#PAY)};
        let new_question_payout_ongoing: MarketTypes.Question = {single_question_no_answer.questions_state[0] with status = #PAYOUT(#ONGOING)}; */
        //let new_question_closed: MarketTypes.Question = {single_question_no_answer.questions_state[0] with status = #CLOSED};

        Debug.print(debug_show(await market_canister.set_db({ state_two_users with questions_state = [{single_question_no_answer.questions_state[0] with status = #PICKANSWER}] }: State)));
        let answer_wrong_status_pickanswer = await b_user.answer_question("0", "Integration with popular libraries: Reducer pattern is popularized by libraries like Redux, which provide additional benefits such as middleware support, devtools integration, and the ability to manage your application's entire state in a single store. This further enhances the advantages of the reducer pattern.");

        Debug.print(debug_show(await market_canister.set_db({ state_two_users with questions_state = [{single_question_no_answer.questions_state[0] with status = #DISPUTABLE}] }: State)));
        let answer_wrong_status_disputable = await b_user.answer_question("0", "Integration with popular libraries: Reducer pattern is popularized by libraries like Redux, which provide additional benefits such as middleware support, devtools integration, and the ability to manage your application's entire state in a single store. This further enhances the advantages of the reducer pattern.");

        Debug.print(debug_show(await market_canister.set_db({ state_two_users with questions_state = [{single_question_no_answer.questions_state[0] with status = #ARBITRATION}] }: State)));
        let answer_wrong_status_arbitration = await b_user.answer_question("0", "Integration with popular libraries: Reducer pattern is popularized by libraries like Redux, which provide additional benefits such as middleware support, devtools integration, and the ability to manage your application's entire state in a single store. This further enhances the advantages of the reducer pattern.");

        Debug.print(debug_show(await market_canister.set_db({ state_two_users with questions_state = [{single_question_no_answer.questions_state[0] with status = #PAYOUT(#PAY)}] }: State)));
        let answer_wrong_status_payout_pay = await b_user.answer_question("0", "Integration with popular libraries: Reducer pattern is popularized by libraries like Redux, which provide additional benefits such as middleware support, devtools integration, and the ability to manage your application's entire state in a single store. This further enhances the advantages of the reducer pattern.");

        Debug.print(debug_show(await market_canister.set_db({ state_two_users with questions_state = [{single_question_no_answer.questions_state[0] with status = #PAYOUT(#ONGOING)}] }: State)));
        let answer_wrong_status_payout_ongoing = await b_user.answer_question("0", "Integration with popular libraries: Reducer pattern is popularized by libraries like Redux, which provide additional benefits such as middleware support, devtools integration, and the ability to manage your application's entire state in a single store. This further enhances the advantages of the reducer pattern.");

        Debug.print(debug_show(await market_canister.set_db({ state_two_users with questions_state = [{single_question_no_answer.questions_state[0] with status = #CLOSED}] }: State)));
        let answer_wrong_status_closed = await b_user.answer_question("0", "Integration with popular libraries: Reducer pattern is popularized by libraries like Redux, which provide additional benefits such as middleware support, devtools integration, and the ability to manage your application's entire state in a single store. This further enhances the advantages of the reducer pattern.");

        // finally works
        Debug.print(debug_show(await market_canister.set_db({ state_two_users with questions_state = [{single_question_no_answer.questions_state[0] with status = #OPEN}] }: State)));
        let answer_submitted = await b_user.answer_question("0", "Integration with popular libraries: Reducer pattern is popularized by libraries like Redux, which provide additional benefits such as middleware support, devtools integration, and the ability to manage your application's entire state in a single store. This further enhances the advantages of the reducer pattern.");
        
        let answer_submitted_state = await market_canister.get_db();

        // correct state transition to pickanswer
        ignore await market_canister.set_db({answer_submitted_state with questions_state = [{answer_submitted_state.questions_state[0] with status_end_date:Int32 = Int32.fromInt(Time.now() / 60000000000) - 10 }]}: State);
        let time_transition_to_pickanswer = await b_user.answer_question("0", "Integration with popular libraries: Reducer pattern is popularized by libraries like Redux, which provide additional benefits such as middleware support, devtools integration, and the ability to manage your application's entire state in a single store. This further enhances the advantages of the reducer pattern.");
        let time_transition_to_pickanswer_state = await market_canister.get_db();
        Debug.print("time_transition_to_pickanswer_state" # debug_show(time_transition_to_pickanswer_state));
        
        // correct state transition to payout
        ignore await market_canister.set_db({ state_two_users with questions_state = [{single_question_no_answer.questions_state[0] with status_end_date = Int32.fromInt(Time.now() / 60000000000) - 10 }] }: State);
        let time_transition_to_payout = await b_user.answer_question("0", "Integration with popular libraries: Reducer pattern is popularized by libraries like Redux, which provide additional benefits such as middleware support, devtools integration, and the ability to manage your application's entire state in a single store. This further enhances the advantages of the reducer pattern.");
        let time_transition_to_payout_state = await market_canister.get_db(); 

        let suite = S.suite("Integration with popular libraries: Reducer pattern is popularized by libraries like Redux, which provide additional benefits such as middleware support, devtools integration, and the ability to manage your application's entire state in a single store. This further enhances the advantages of the reducer pattern.ing question", [
            S.test(
                "user does not exist",
                switch(answer_no_user){
                    case(#err(err)){
                        if(err == #UserNotFound){
                            "expected error"
                        } else {
                            "unexpected error"
                        };
                    };
                    case(#ok(res)){ "expected error" };
                },
                M.equals<Text>(T.text("expected error"))
            ),
            S.test(
                "question does not exist",
                switch(answer_no_question){
                    case(#err(err)){
                        if(err == #QuestionNotFound){
                            "expected error"
                        } else {
                            "unexpected error"
                        };
                    };
                    case(#ok(res)){ "expected error" };
                },
                M.equals<Text>(T.text("expected error"))
            ),
            S.test(
                "question author is not allowed to answer",
                switch(answer_is_author){
                    case(#err(err)){
                        if(err == #NotAllowed){
                            "expected error"
                        } else {
                            "unexpected error"
                        };
                    };
                    case(#ok(res)){ "expected error" };
                },
                M.equals<Text>(T.text("expected error"))
            ),
            S.test(
                "all other statuses fail",
                do {
                    var isUnexpected = false;
                    switch(answer_wrong_status_pickanswer){case(#err(err)){if(err != #WrongStatus){isUnexpected := true}}; case(#ok(res)){ isUnexpected := true; }};
                    switch(answer_wrong_status_disputable){case(#err(err)){if(err != #WrongStatus){isUnexpected := true}}; case(#ok(res)){ isUnexpected := true; }};
                    switch(answer_wrong_status_arbitration){case(#err(err)){if(err != #WrongStatus){isUnexpected := true}}; case(#ok(res)){ isUnexpected := true; }};
                    switch(answer_wrong_status_payout_pay){case(#err(err)){if(err != #WrongStatus){isUnexpected := true}}; case(#ok(res)){ isUnexpected := true; }};
                    switch(answer_wrong_status_payout_ongoing){case(#err(err)){if(err != #WrongStatus){isUnexpected := true}}; case(#ok(res)){ isUnexpected := true; }};
                    switch(answer_wrong_status_closed){case(#err(err)){if(err != #WrongStatus){isUnexpected := true}}; case(#ok(res)){ isUnexpected := true; }};
                    if(isUnexpected){
                        "unexpected error"
                    } else {
                        "expected error"
                    };
                },
                M.equals<Text>(T.text("expected error"))
            ),
           
            S.test(
                "submitted correctly before time is up",
                switch(answer_submitted){
                    case(#err(err)){
                        "unexpected error"
                    };
                    case(#ok(res)){ 
                        let answer_in_state = answer_submitted_state.answers_state[0];
                        if(
                            // TODO: should be resetable
                            //answer_in_state.id == "0" and
                            answer_in_state.author_id == Principal.fromActor(b_user)  and
                            answer_in_state.content == "Integration with popular libraries: Reducer pattern is popularized by libraries like Redux, which provide additional benefits such as middleware support, devtools integration, and the ability to manage your application's entire state in a single store. This further enhances the advantages of the reducer pattern." and
                            answer_in_state.question_id == "0" 
                        ){ "success" } else {"unexpected state"};
                    };
                },
                M.equals<Text>(T.text("success"))
            ),
            S.test(
                "correct status transition with answers",
                do {
                    switch(time_transition_to_pickanswer){
                        case(#err(err)){
                            if(err != #WrongStatus){
                               "unexpected error"
                            } else {
                                // TODO: test more parts of the state
                                let question_state = time_transition_to_pickanswer_state.questions_state[0];
                                if(question_state.status == #PICKANSWER){ "success state update" } else {"unexpected state"};
                            };
                        };
                        case(#ok(res)){
                            "unexpected res"
                        }
                    }
                },
                M.equals<Text>(T.text("success state update"))
            ),
            S.test(
                "correct status transition with no answers",
                do {
                    switch(time_transition_to_payout){
                        case(#err(err)){
                            if(err != #WrongStatus){
                               "unexpected error"
                            } else {
                                // TODO: test more parts of the state
                                let question_state = time_transition_to_payout_state.questions_state[0];
                                if(question_state.status == #PAYOUT(#PAY)){ "success state update" } else {"unexpected state"};
                            };
                        };
                        case(#ok(res)){
                            "unexpected res"
                        }
                    }
                },
                M.equals<Text>(T.text("success state update"))
            ), 
          // Check what else we did with ic-repl
          // TODO: heartbeat
          // TODO: compare more of the state, especially the times
        ]);
        S.run(suite);
        return #success;
    };

    // --------- pick_answer ---------
    public shared func testPickAnswer() : async {#success; #fail : Text} {

        // existance: user, question, answer
        // permission: user is author, answer is in question
        // conditions: status==pickanswer, time is not up
        // state check: is all correctly assigned
        let a_user: Test_User.test_user = await  create_test_user();
        let b_user: Test_User.test_user = await  create_test_user();
        let c_user: Test_User.test_user = await  create_test_user();

        let base_state:State = {
            answers_state = [{
                id = "0";
                author_id = Principal.fromActor(b_user);
                question_id = "0";
                creation_date:Int32 = Int32.fromInt(Time.now() / 60000000000) +1;
                content = "Integration with popular libraries: Reducer pattern is popularized by libraries like Redux, which provide additional benefits such as middleware support, devtools integration, and the ability to manage your application's entire state in a single store. This further enhances the advantages of the reducer pattern.";
            }];
            invoices_state = [{
                id = 0;
                buyer_id = Principal.fromActor(a_user);
                question_id = ?"0";
            },
            {
                id = 1;
                buyer_id = Principal.fromActor(a_user);
                question_id = ?"1";
            }];
            questions_state = [{
                id= "0";
                author_id= Principal.fromActor(a_user);
                invoice_id= 0; 
                creation_date : Int32 = Int32.fromInt(Time.now() / 60000000000) +1;
                status= #PICKANSWER;
                status_update_date: Int32 = Int32.fromInt(Time.now() / 60000000000)+1;
                status_end_date : Int32 = Int32.fromInt(Time.now() / 60000000000)+2;
                open_duration= 2;
                title = "test question";
                content = "Predictable state updates: Reducer functions are pure, meaning they don't have side effects and only depend on their input arguments. This makes state updates more predictable and easier to reason about. You can easily understand how the state will change based on the dispatched action without worrying about unintended consequences.";
                reward = 1_300_000:Int32;
                potentialWinner = null;
                finalWinner = null;
                close_transaction_block_height= null;
                answers = ["0"]; 
            },
            {
                id= "1";
                author_id= Principal.fromActor(a_user);
                invoice_id= 1; 
                creation_date: Int32 = Int32.fromInt(Time.now() / 60000000000) +1;
                status= #PICKANSWER;
                status_update_date: Int32 = Int32.fromInt(Time.now() / 60000000000)+1;
                status_end_date: Int32 = Int32.fromInt(Time.now() / 60000000000)+2;
                open_duration= 2;
                title = "test question";
                content = "Predictable state updates: Reducer functions are pure, meaning they don't have side effects and only depend on their input arguments. This makes state updates more predictable and easier to reason about. You can easily understand how the state will change based on the dispatched action without worrying about unintended consequences.";
                reward = 1_300_000:Int32;
                potentialWinner = null;
                finalWinner = null;
                close_transaction_block_height= null;
                answers = []; 
            }];
            users_state = [{
                id = Principal.fromActor(a_user); 
                answers = []; 
                avatar = null; 
                invoices = [0, 1]; 
                joined_date: Int32 = Int32.fromInt(Time.now() / 60000000000);
                name = "John"; 
                questions = ["0", "1"]
            },
            {
                id = Principal.fromActor(b_user); 
                answers = ["0"]; 
                avatar = null; 
                invoices = []; 
                joined_date: Int32 = Int32.fromInt(Time.now() / 60000000000);
                name = "Tim"; 
                questions = []
            }];
        };

        ignore await market_canister.set_db(base_state:State);

        // user does not exists
        let uknown_user = await c_user.pick_answer("0", "0");
        let uknown_user_state = await market_canister.get_db();

        // question does not exist
        let unknown_question = await a_user.pick_answer("10", "0");
        let unknown_question_state = await market_canister.get_db();

        // answer does not exist
        let unknown_answer = await a_user.pick_answer("0", "3");
        let unknown_answer_state = await market_canister.get_db();
        
        // is not author
        let not_author = await b_user.pick_answer("0", "0");
        let not_author_state = await market_canister.get_db();
    
        // answer is not in question
        let answer_not_in_question = await a_user.pick_answer("1", "0");
        let answer_not_in_question_state = await market_canister.get_db();
        Debug.print("random print 2");

        // status is not pickanswer
        // --> state change
        let pickanswer_wrong_status_open_state_before = await market_canister.set_db({ base_state with questions_state = [
            {base_state.questions_state[0] with status = #OPEN },
            {base_state.questions_state[1] with status = #OPEN }
        ]}: State);
        let pickanswer_wrong_status_open = await a_user.pick_answer("0", "0");
        let pickanswer_wrong_status_open_state_after = await market_canister.get_db();

        let pickanswer_wrong_status_disputable_state_before = await market_canister.set_db({ base_state with questions_state = [
            {base_state.questions_state[0] with status = #DISPUTABLE },
            {base_state.questions_state[1] with status = #DISPUTABLE }
        ]}: State);
        let pickanswer_wrong_status_disputable = await a_user.pick_answer("0", "0");
        let pickanswer_wrong_status_disputable_state_after = await market_canister.get_db();

        let pickanswer_wrong_status_arbitration_state_before = await market_canister.set_db({ base_state with questions_state = [
            {base_state.questions_state[0] with status = #ARBITRATION },
            {base_state.questions_state[1] with status = #ARBITRATION }
        ]}: State);
        let pickanswer_wrong_status_arbitration = await a_user.pick_answer("0", "0");
        let pickanswer_wrong_status_arbitration_state_after = await market_canister.get_db();
       
        let pickanswer_wrong_status_payout_pay_state_before = await market_canister.set_db({ base_state with questions_state = [
            {base_state.questions_state[0] with status = #PAYOUT(#PAY) },
            {base_state.questions_state[1] with status = #PAYOUT(#PAY) }
        ]}: State);
        let pickanswer_wrong_status_payout_pay = await a_user.pick_answer("0", "0");
        let pickanswer_wrong_status_payout_pay_state_after = await market_canister.get_db();

        let pickanswer_wrong_status_payout_ongoing_state_before = await market_canister.set_db({ base_state with questions_state = [
            {base_state.questions_state[0] with status = #PAYOUT(#ONGOING) },
            {base_state.questions_state[1] with status = #PAYOUT(#ONGOING) }
        ]}: State);
        let pickanswer_wrong_status_payout_ongoing = await a_user.pick_answer("0", "0");
        let pickanswer_wrong_status_payout_ongoing_state_after = await market_canister.get_db();

        let pickanswer_wrong_status_payout_closed_state_before = await market_canister.set_db({ base_state with questions_state = [
            {base_state.questions_state[0] with status = #CLOSED },
            {base_state.questions_state[1] with status = #CLOSED }
        ]}: State);
        let pickanswer_wrong_status_payout_closed = await a_user.pick_answer("0", "0");
        let pickanswer_wrong_status_payout_closed_state_after = await market_canister.get_db();

        // time is not up -> success
        let pickanswer_right_status_state_before = await market_canister.set_db({ base_state with questions_state = [
            {base_state.questions_state[0] with status = #PICKANSWER },
            {base_state.questions_state[1] with status = #PICKANSWER }
        ]}: State);
        let pickanswer_right_status = await a_user.pick_answer("0", "0");
        let pickanswer_right_status_state_after = await market_canister.get_db();

        // time is up -> update
        let pickanswer_time_state_before = await market_canister.set_db({ base_state with questions_state = [
            {base_state.questions_state[0] with status_end_date = base_state.questions_state[0].status_end_date - 10 },
            {base_state.questions_state[1] with status_end_date = base_state.questions_state[1].status_end_date - 10 }
        ]}: State);
        let pickanswer_time = await a_user.pick_answer("0", "0");
        let pickanswer_time_state_after = await market_canister.get_db();

        let suite = S.suite("test pick answer", [
            S.test("unknown user should not pick a winner", 
                switch(uknown_user){case(#ok(res)){ "unexpected success" };
                    case(#err(err)){ 
                        if( 
                            err == #UserNotFound and 
                            uknown_user_state == base_state
                        ){ "expected error"} else {"unexpected error"};
                    };
                }, 
            M.equals<Text>(T.text("expected error"))),

            S.test("unknown question", 
                switch(unknown_question){case(#ok(res)){ "unexpected success" };
                    case(#err(err)){ 
                        if( 
                            err == #QuestionNotFound and 
                            unknown_question_state == base_state
                        ){ "expected error"} else {"unexpected error"};
                    };
                }, 
            M.equals<Text>(T.text("expected error"))),

            S.test("unknown answer", 
                switch(unknown_answer){case(#ok(res)){ "unexpected success" };
                    case(#err(err)){ 
                        if( 
                            err == #AnswerNotFound and 
                            unknown_answer_state == base_state
                        ){ "expected error"} else {"unexpected error"};
                    };
                }, 
            M.equals<Text>(T.text("expected error"))),

            S.test("not question author", 
                switch(not_author){case(#ok(res)){ "unexpected success" };
                    case(#err(err)){ 
                        if( 
                            err == #NotAllowed and 
                            not_author_state == base_state
                        ){ "expected error"} else {"unexpected error"};
                    };
                }, 
            M.equals<Text>(T.text("expected error"))),

            S.test("answer is not in question", 
                switch(answer_not_in_question){case(#ok(res)){ "unexpected success" };
                    case(#err(err)){ 
                        if( 
                            err == #NotAllowed and 
                            answer_not_in_question_state == base_state
                        ){ "expected error"} else {"unexpected error"};
                    };
                }, 
            M.equals<Text>(T.text("expected error"))),

            S.test("status not being pick answer does not work",
                do {
                    var unexpectedOutcome = false;

                    switch(pickanswer_wrong_status_open){case(#ok(res)){ unexpectedOutcome := true}; case(#err(err)){ if(err != #WrongStatus){unexpectedOutcome := true;} }}; 
                    switch(pickanswer_wrong_status_disputable){case(#ok(res)){ unexpectedOutcome := true}; case(#err(err)){ if(err != #WrongStatus){unexpectedOutcome := true;} }}; 
                    switch(pickanswer_wrong_status_arbitration){case(#ok(res)){ unexpectedOutcome := true}; case(#err(err)){ if(err != #WrongStatus){unexpectedOutcome := true;} }}; 
                    switch(pickanswer_wrong_status_payout_pay){case(#ok(res)){ unexpectedOutcome := true}; case(#err(err)){ if(err != #WrongStatus){unexpectedOutcome := true;} }}; 
                    switch(pickanswer_wrong_status_payout_ongoing){case(#ok(res)){ unexpectedOutcome := true}; case(#err(err)){ if(err != #WrongStatus){unexpectedOutcome := true;} }}; 
                    switch(pickanswer_wrong_status_payout_closed){case(#ok(res)){ unexpectedOutcome := true}; case(#err(err)){ if(err != #WrongStatus){unexpectedOutcome := true;} }}; 
                    
                    if(pickanswer_wrong_status_open_state_before != pickanswer_wrong_status_open_state_after){unexpectedOutcome := true;};
                    if(pickanswer_wrong_status_disputable_state_before != pickanswer_wrong_status_disputable_state_after){unexpectedOutcome := true;};
                    if(pickanswer_wrong_status_arbitration_state_before != pickanswer_wrong_status_arbitration_state_after){unexpectedOutcome := true;};
                    if(pickanswer_wrong_status_payout_pay_state_before != pickanswer_wrong_status_payout_pay_state_after){unexpectedOutcome := true;};
                    if(pickanswer_wrong_status_payout_ongoing_state_before != pickanswer_wrong_status_payout_ongoing_state_after){unexpectedOutcome := true;};
                    if(pickanswer_wrong_status_payout_closed_state_before != pickanswer_wrong_status_payout_closed_state_after){unexpectedOutcome := true;};
        
                    if(unexpectedOutcome){ "unexpected" } else {"expected error"}

                },
            M.equals<Text>(T.text("expected error"))),

            S.test("state transition to disputable",
                switch(pickanswer_right_status){case(#err(err)){ "unexpected error" };
                    case(#ok(res)){ 
                        if( 
                            pickanswer_right_status_state_after.questions_state[0].status == #DISPUTABLE and
                            pickanswer_right_status_state_after.questions_state[0].potentialWinner != null
                        ){ "success"} else {"unexpected error"};
                    };
                }, 
            M.equals<Text>(T.text("success"))),

             S.test("time is up",
                switch(pickanswer_right_status){case(#err(err)){ "unexpected error" };
                    case(#ok(res)){ 
                        if( pickanswer_time_state_after.questions_state[0].status == #ARBITRATION){ "success"} else {"unexpected error"};
                    };
                }, 
            M.equals<Text>(T.text("success"))),
        ]);
        
        S.run(suite);
        return #success;
    };

    // --------- disputable ---------
    public shared func testDisputable() : async {#success; #fail : Text} {
        let a_user: Test_User.test_user = await  create_test_user();
        let b_user: Test_User.test_user = await  create_test_user();
        let c_user: Test_User.test_user = await  create_test_user();
        let d_user: Test_User.test_user = await  create_test_user();
        let e_user: Test_User.test_user = await  create_test_user();

        Debug.print("running testDisputable");
        // TODO: the state update times are always confusing things.
        let base_state:State = {
            users_state = [
                {
                    id = Principal.fromActor(a_user); 
                    answers = []; 
                    avatar = null; 
                    invoices = [0, 1]; 
                    joined_date: Int32 = Int32.fromInt(Time.now() / 60000000000);
                    name = "John"; 
                    questions = ["0", "1"]
                },
                {
                    id = Principal.fromActor(b_user); 
                    answers = ["0"]; 
                    avatar = null; 
                    invoices = []; 
                    joined_date: Int32 = Int32.fromInt(Time.now() / 60000000000);
                    name = "Tim"; 
                    questions = []
                },
                {
                    id = Principal.fromActor(c_user); 
                    answers = []; 
                    avatar = null; 
                    invoices = []; 
                    joined_date: Int32 = Int32.fromInt(Time.now() / 60000000000);
                    name = "Steve"; 
                    questions = []
                },
                {
                    id = Principal.fromActor(d_user); 
                    answers = []; 
                    avatar = null; 
                    invoices = []; 
                    joined_date: Int32 = Int32.fromInt(Time.now() / 60000000000);
                    name = "Mark"; 
                    questions = []
                }
            ];
            invoices_state = [
                {
                    id = 0;
                    buyer_id = Principal.fromActor(a_user);
                    question_id = ?"0";
                },
                {
                    id = 1;
                    buyer_id = Principal.fromActor(a_user);
                    question_id = ?"1";
                }
            ];
            questions_state = [
                {
                    id= "0";
                    invoice_id= 0; 
                    author_id= Principal.fromActor(a_user);

                    creation_date : Int32 = Int32.fromInt(Time.now() / 60000000000) +1;
                    open_duration= 2;
                    title = "test question";
                    content = "Predictable state updates: Reducer functions are pure, meaning they don't have side effects and only depend on their input arguments. This makes state updates more predictable and easier to reason about. You can easily understand how the state will change based on the dispatched action without worrying about unintended consequences.";
                    reward = 1_300_000:Int32;

                    status= #DISPUTABLE;
                    status_update_date: Int32 = Int32.fromInt(Time.now() / 60000000000)+1;
                    status_end_date: Int32 = Int32.fromInt(Time.now() / 60000000000)+2;
                    
                    answers = ["0", "1"]; 
                    potentialWinner = ?"1";
                    finalWinner = null;
                    close_transaction_block_height= null;
                },

                // TODO: this is incorrect cannot have no potential winner in that state
                {
                    id= "1";
                    author_id= Principal.fromActor(a_user);
                    invoice_id= 1; 
                    
                    creation_date: Int32 = Int32.fromInt(Time.now() / 60000000000) +1;
                    open_duration= 2;
                    title = "test question";
                    content = "Predictable state updates: Reducer functions are pure, meaning they don't have side effects and only depend on their input arguments. This makes state updates more predictable and easier to reason about. You can easily understand how the state will change based on the dispatched action without worrying about unintended consequences.";
                    reward = 1_300_000:Int32;

                    status= #DISPUTABLE;
                    status_update_date: Int32 = Int32.fromInt(Time.now() / 60000000000)+1;
                    status_end_date : Int32 = Int32.fromInt(Time.now() / 60000000000)+2;
                    
                    answers = []; 
                    potentialWinner = null;
                    finalWinner = null;
                    close_transaction_block_height= null;
                }
            ];
            answers_state = [
                {
                    id = "0";
                    author_id = Principal.fromActor(b_user);
                    question_id = "0";
                    creation_date : Int32 = Int32.fromInt(Time.now() / 60000000000) +1;
                    content = "Integration with popular libraries: Reducer pattern is popularized by libraries like Redux, which provide additional benefits such as middleware support, devtools integration, and the ability to manage your application's entire state in a single store. This further enhances the advantages of the reducer pattern.";
                },
                {
                    id = "1";
                    author_id = Principal.fromActor(c_user);
                    question_id = "0";
                    creation_date : Int32 = Int32.fromInt(Time.now() / 60000000000) +1;
                    content = "Integration with popular libraries: Reducer pattern is popularized by libraries like Redux, which provide additional benefits such as middleware support, devtools integration, and the ability to manage your application's entire state in a single store. This further enhances the advantages of the reducer pattern.";
                }
            ];
        };

        ignore await market_canister.set_db(base_state:State);

        // user does not exist 
        let uknown_user = await d_user.dispute("0");
        let uknown_user_state = await market_canister.get_db();

        // question does not exist
        let unknown_question = await b_user.dispute("10");
        let unknown_question_state = await market_canister.get_db();

        // user did not answer
        let user_did_not_answer = await d_user.dispute("0");
        let user_did_not_answer_state = await market_canister.get_db();
        
        // user is author
        let is_author = await a_user.dispute("0");
        let is_author_state = await market_canister.get_db();
        
        // wrong status
        let disputable_wrong_status_open_state_before = await market_canister.set_db({ base_state with questions_state = [
            {base_state.questions_state[0] with status = #OPEN },
            {base_state.questions_state[1] with status = #OPEN }
        ]}: State);
        let disputable_wrong_status_open = await b_user.dispute("0");
        let disputable_wrong_status_open_state_after = await market_canister.get_db();

        let disputable_wrong_status_pickanswer_state_before = await market_canister.set_db({ base_state with questions_state = [
            {base_state.questions_state[0] with status = #PICKANSWER },
            {base_state.questions_state[1] with status = #PICKANSWER }
        ]}: State);
        let disputable_wrong_status_pickanswer = await b_user.dispute("0");
        let disputable_wrong_status_pickanswer_state_after = await market_canister.get_db();

        let disputable_wrong_status_arbitration_state_before = await market_canister.set_db({ base_state with questions_state = [
            {base_state.questions_state[0] with status = #ARBITRATION },
            {base_state.questions_state[1] with status = #ARBITRATION }
        ]}: State);
        let disputable_wrong_status_arbitration = await b_user.dispute("0");
        let disputable_wrong_status_arbitration_state_after = await market_canister.get_db();
       
        let disputable_wrong_status_payout_pay_state_before = await market_canister.set_db({ base_state with questions_state = [
            {base_state.questions_state[0] with status = #PAYOUT(#PAY) },
            {base_state.questions_state[1] with status = #PAYOUT(#PAY) }
        ]}: State);
        let disputable_wrong_status_payout_pay = await b_user.dispute("0");
        let disputable_wrong_status_payout_pay_state_after = await market_canister.get_db();

        let disputable_wrong_status_payout_ongoing_state_before = await market_canister.set_db({ base_state with questions_state = [
            {base_state.questions_state[0] with status = #PAYOUT(#ONGOING) },
            {base_state.questions_state[1] with status = #PAYOUT(#ONGOING) }
        ]}: State);
        let disputable_wrong_status_payout_ongoing = await b_user.dispute("0");
        let disputable_wrong_status_payout_ongoing_state_after = await market_canister.get_db();

        let disputable_wrong_status_payout_closed_state_before = await market_canister.set_db({ base_state with questions_state = [
            {base_state.questions_state[0] with status = #CLOSED },
            {base_state.questions_state[1] with status = #CLOSED }
        ]}: State);
        let disputable_wrong_status_payout_closed = await b_user.dispute("0");
        let disputable_wrong_status_payout_closed_state_after = await market_canister.get_db();

        // action based state transition
        let disputable_right_status_state_before = await market_canister.set_db({ base_state with questions_state = [
            {base_state.questions_state[0] with status = #DISPUTABLE },
            {base_state.questions_state[1] with status = #DISPUTABLE }
        ]}: State);
        let disputable_right_status = await b_user.dispute("0");
        let disputable_right_status_state_after = await market_canister.get_db();

        // time base state transition
        let disputable_time_state_before = await market_canister.set_db({ base_state with questions_state = [
            {base_state.questions_state[0] with status_end_date = base_state.questions_state[0].status_end_date - 10 },
            {base_state.questions_state[1] with status_end_date = base_state.questions_state[1].status_end_date - 10 }
        ]}: State);
        let disputable_time = await b_user.dispute("0");
        let disputable_time_state_after = await market_canister.get_db();


        let suite = S.suite("test disputable", [
            S.test("user does not exist ",
                switch(uknown_user){case(#ok(res)){ "unexpected success" };
                    case(#err(err)){ 
                        if( 
                            err == #NotAllowed and 
                            uknown_user_state == base_state
                        ){ "expected error"} else {"unexpected error"};
                    };
                }, 
                M.equals<Text>(T.text("expected error"))
            ),
            
            S.test("question does not exist",
                switch(unknown_question){case(#ok(res)){ "unexpected success" };
                    case(#err(err)){ 
                        if( 
                            err == #QuestionNotFound and 
                            unknown_question_state == base_state
                        ){ "expected error"} else {"unexpected error"};
                    };
                },
                M.equals<Text>(T.text("expected error"))
            ),
            
            S.test("user did not answer",
                switch(user_did_not_answer){case(#ok(res)){ "unexpected success" };
                    case(#err(err)){ 
                        if( 
                            err == #NotAllowed and 
                            user_did_not_answer_state == base_state
                        ){ "expected error"} else {"unexpected error"};
                    };
                },
                M.equals<Text>(T.text("expected error"))
            ),
             
            S.test("user is author",
                switch(is_author){case(#ok(res)){ "unexpected success" };
                    case(#err(err)){ 
                        if( 
                            err == #NotAllowed and 
                            is_author_state == base_state
                        ){ "expected error"} else {"unexpected error"};
                    };
                },
                M.equals<Text>(T.text("expected error"))
            ),
                        
            S.test("wrong status",
                 do {
                    var unexpectedOutcome = false;
                    // TODO: correct cases not be in here
                    switch(disputable_wrong_status_open){case(#ok(res)){ unexpectedOutcome := true}; case(#err(err)){ if(err != #WrongStatus){unexpectedOutcome := true;} }}; 
                    switch(disputable_wrong_status_pickanswer){case(#ok(res)){ unexpectedOutcome := true}; case(#err(err)){ if(err != #WrongStatus){unexpectedOutcome := true;} }}; 
                    switch(disputable_wrong_status_arbitration){case(#ok(res)){ unexpectedOutcome := true}; case(#err(err)){ if(err != #WrongStatus){unexpectedOutcome := true;} }}; 
                    switch(disputable_wrong_status_payout_pay){case(#ok(res)){ unexpectedOutcome := true}; case(#err(err)){ if(err != #WrongStatus){unexpectedOutcome := true;} }}; 
                    switch(disputable_wrong_status_payout_ongoing){case(#ok(res)){ unexpectedOutcome := true}; case(#err(err)){ if(err != #WrongStatus){unexpectedOutcome := true;} }}; 
                    switch(disputable_wrong_status_payout_closed){case(#ok(res)){ unexpectedOutcome := true}; case(#err(err)){ if(err != #WrongStatus){unexpectedOutcome := true;} }}; 
                    
                    if(disputable_wrong_status_open_state_before != disputable_wrong_status_open_state_after){unexpectedOutcome := true;};
                    if(disputable_wrong_status_pickanswer_state_before != disputable_wrong_status_pickanswer_state_after){unexpectedOutcome := true;};
                    if(disputable_wrong_status_arbitration_state_before != disputable_wrong_status_arbitration_state_after){unexpectedOutcome := true;};
                    if(disputable_wrong_status_payout_pay_state_before != disputable_wrong_status_payout_pay_state_after){unexpectedOutcome := true;};
                    if(disputable_wrong_status_payout_ongoing_state_before != disputable_wrong_status_payout_ongoing_state_after){unexpectedOutcome := true;};
                    if(disputable_wrong_status_payout_closed_state_before != disputable_wrong_status_payout_closed_state_after){unexpectedOutcome := true;};
        
                    if(unexpectedOutcome){ "unexpected" } else {"expected error"}

                },
                M.equals<Text>(T.text("expected error"))
            ),

            S.test("action base state transition",
                switch(disputable_right_status){
                    case(#err(err)){ "unexpected error" };
                    case(#ok(res)){ 
                        if( 
                            disputable_right_status_state_after.questions_state[0].status == #ARBITRATION and
                            disputable_right_status_state_after.questions_state[0].potentialWinner != null
                        ){ "success"} else {"unexpected state"};
                    };
                }, 
                M.equals<Text>(T.text("success"))
            ),

            S.test("time base state transition",
                switch(disputable_time){case(#err(err)){
                        if( 
                            disputable_time_state_after.questions_state[0].status == #PAYOUT(#PAY)       
                        ){ "success"} else {"unexpected state"};
                    };
                    case(#ok(res)){ "unexpected function success" };
                },
                M.equals<Text>(T.text("success"))
            ),
        ]);
        
        S.run(suite);
        return #success;
    };



    public shared func testArbitration() : async {#success; #fail : Text} {
        /* 
        I'm choosing now the final winner basically (and status end date / status update)
        And status

        Only admin should be allowed to do this -> make test runner admin (pain)

        Prior state can be in several different versions. Either winner was picked or not
        But I ignore this and just provide the one I want. 
        
        I can either pass the question id or the answer id.

        Test
        - not admin
        - no question
        - wrong status
        - has to work if I pass "Question" for final winner
        - has to work if I pass "Answer" for final winner

        Ok how do I make test_runner deployer?
        - either it deploys and is deployer
        - or I add it? 
        */      
        
        Debug.print("running testArbitration");

        let a_user: Test_User.test_user = await  create_test_user();
        let b_user: Test_User.test_user = await  create_test_user();
        let c_user: Test_User.test_user = await  create_test_user();

        let base_state:State = {
            users_state = [
                {
                    id = Principal.fromActor(a_user); 
                    answers = []; 
                    avatar = null; 
                    invoices = [0, 1]; 
                    joined_date: Int32 = Int32.fromInt(Time.now() / 60000000000);
                    name = "John"; 
                    questions = ["0", "1"]
                },
                {
                    id = Principal.fromActor(b_user); 
                    answers = ["0"]; 
                    avatar = null; 
                    invoices = []; 
                    joined_date : Int32 = Int32.fromInt(Time.now() / 60000000000);
                    name = "Tim"; 
                    questions = []
                },
                {
                    id = Principal.fromActor(c_user); 
                    answers = []; 
                    avatar = null; 
                    invoices = []; 
                    joined_date: Int32 = Int32.fromInt(Time.now() / 60000000000);
                    name = "Steve"; 
                    questions = []
                },
            ];
            invoices_state = [
                {
                    id = 0;
                    buyer_id = Principal.fromActor(a_user);
                    question_id = ?"0";
                },
            ];
            questions_state = [
                {
                    id= "0";
                    invoice_id= 0; 
                    author_id= Principal.fromActor(a_user);

                    creation_date : Int32 = Int32.fromInt(Time.now() / 60000000000) +1;
                    open_duration= 2;
                    title = "test question";
                    content = "Predictable state updates: Reducer functions are pure, meaning they don't have side effects and only depend on their input arguments. This makes state updates more predictable and easier to reason about. You can easily understand how the state will change based on the dispatched action without worrying about unintended consequences.";
                    reward = 1_300_000:Int32;

                    status= #ARBITRATION;
                    status_update_date: Int32 = Int32.fromInt(Time.now() / 60000000000)+1;
                    status_end_date : Int32 = Int32.fromInt(Time.now() / 60000000000)+2;
                    
                    answers = ["0", "1"]; 
                    potentialWinner = ?"1";
                    finalWinner = null;
                    close_transaction_block_height= null;
                },
            ];
            answers_state = [
                {
                    id = "0";
                    author_id = Principal.fromActor(b_user);
                    question_id = "0";
                    creation_date: Int32 = Int32.fromInt(Time.now() / 60000000000) +1;
                    content = "Integration with popular libraries: Reducer pattern is popularized by libraries like Redux, which provide additional benefits such as middleware support, devtools integration, and the ability to manage your application's entire state in a single store. This further enhances the advantages of the reducer pattern.";
                },
                {
                    id = "1";
                    author_id = Principal.fromActor(c_user);
                    question_id = "0";
                    creation_date: Int32 = Int32.fromInt(Time.now() / 60000000000) +1;
                    content = "Integration with popular libraries: Reducer pattern is popularized by libraries like Redux, which provide additional benefits such as middleware support, devtools integration, and the ability to manage your application's entire state in a single store. This further enhances the advantages of the reducer pattern.";
                }
            ];
        };

        ignore await market_canister.set_db(base_state:State);

        // not admin
        let not_admin = await a_user.arbitrate("0", #ANSWER({answer_id="0"}));
        let not_admin_state = await market_canister.get_db();

        // no question
        let unknown_question = await market_canister.arbitrate("10", #QUESTION);
        let unknown_question_state = await market_canister.get_db();

        // wrong status
        let wrong_status_open_state_before = await market_canister.set_db({ base_state with questions_state = [
            {base_state.questions_state[0] with status = #OPEN },
        ]}: State);
        let wrong_status_open = await market_canister.arbitrate("0", #QUESTION);
        let wrong_status_open_state_after = await market_canister.get_db();

        let wrong_status_pickanswer_state_before = await market_canister.set_db({ base_state with questions_state = [
            {base_state.questions_state[0] with status = #PICKANSWER },
        ]}: State);
        let wrong_status_pickanswer = await market_canister.arbitrate("0", #QUESTION);
        let wrong_status_pickanswer_state_after = await market_canister.get_db();

        let wrong_status_disputable_state_before = await market_canister.set_db({ base_state with questions_state = [
            {base_state.questions_state[0] with status = #DISPUTABLE },
        ]}: State);
        let wrong_status_disputable = await market_canister.arbitrate("0", #QUESTION);
        let wrong_status_disputable_state_after = await market_canister.get_db();

        let wrong_status_payout_pay_state_before = await market_canister.set_db({ base_state with questions_state = [
            {base_state.questions_state[0] with status = #PAYOUT(#PAY) },
        ]}: State);
        let wrong_status_payout_pay = await market_canister.arbitrate("0", #QUESTION);
        let wrong_status_payout_pay_state_after = await market_canister.get_db();

        let wrong_status_payout_ongoing_state_before = await market_canister.set_db({ base_state with questions_state = [
            {base_state.questions_state[0] with status = #PAYOUT(#ONGOING) },
        ]}: State);
        let wrong_status_payout_ongoing = await market_canister.arbitrate("0", #QUESTION);
        let wrong_status_payout_ongoing_state_after = await market_canister.get_db();

        let wrong_status_payout_closed_state_before = await market_canister.set_db({ base_state with questions_state = [
            {base_state.questions_state[0] with status = #CLOSED },
        ]}: State);
        let wrong_status_payout_closed = await market_canister.arbitrate("0", #QUESTION);
        let wrong_status_payout_closed_state_after = await market_canister.get_db();

        // incorrect answer id
        let incorrect_answer_id_state_before = await market_canister.set_db({ base_state with questions_state = [
            {base_state.questions_state[0] with status = #ARBITRATION },
        ]}: State);
        let incorrect_answer_id = await market_canister.arbitrate("0", #ANSWER({answer_id="10"}));
        let incorrect_answer_id_state_after = await market_canister.get_db();

        // should work for correct "Answer" id
        let correct_answer_id_state_before = await market_canister.set_db({ base_state with questions_state = [
            {base_state.questions_state[0] with status = #ARBITRATION },
        ]}: State);
        let correct_answer_id = await market_canister.arbitrate("0", #ANSWER({answer_id="0"}));
        let correct_answer_id_state_after = await market_canister.get_db();

        // has to work if I pass "Question" for final winner
        let right_status_question_state_before = await market_canister.set_db({ base_state with questions_state = [
            {base_state.questions_state[0] with status = #ARBITRATION },
        ]}: State);
        let right_status_question = await market_canister.arbitrate("0", #QUESTION);
        let right_status_question_state_after = await market_canister.get_db();


        let suite = S.suite("test pick answer", [
            S.test("not admin",
            switch(not_admin){case(#ok(res)){ "unexpected success" };
                    case(#err(err)){ 
                        if( 
                            err == #NotAllowed and 
                            not_admin_state == base_state
                        ){ "expected error"} else {"unexpected state"};
                    };
                }, 
            M.equals<Text>(T.text("expected error"))),
            
            S.test("question does not exist",
                switch(unknown_question){case(#ok(res)){ "unexpected success" };
                        case(#err(err)){ 
                            if( 
                                err == #QuestionNotFound and 
                                unknown_question_state == base_state
                            ){ "expected error"} else {"unexpected state"};
                        };
                    },
            M.equals<Text>(T.text("expected error"))),
            
            S.test("wrong status",
             do {
                var unexpectedOutcome = false;
                // TODO: correct cases not be in here
                switch(wrong_status_open){case(#ok(res)){ unexpectedOutcome := true}; case(#err(err)){ if(err != #WrongStatus){unexpectedOutcome := true;} }}; 
                switch(wrong_status_pickanswer){case(#ok(res)){ unexpectedOutcome := true}; case(#err(err)){ if(err != #WrongStatus){unexpectedOutcome := true;} }}; 
                switch(wrong_status_disputable){case(#ok(res)){ unexpectedOutcome := true}; case(#err(err)){ if(err != #WrongStatus){unexpectedOutcome := true;} }}; 
                switch(wrong_status_payout_pay){case(#ok(res)){ unexpectedOutcome := true}; case(#err(err)){ if(err != #WrongStatus){unexpectedOutcome := true;} }}; 
                switch(wrong_status_payout_ongoing){case(#ok(res)){ unexpectedOutcome := true}; case(#err(err)){ if(err != #WrongStatus){unexpectedOutcome := true;} }}; 
                switch(wrong_status_payout_closed){case(#ok(res)){ unexpectedOutcome := true}; case(#err(err)){ if(err != #WrongStatus){unexpectedOutcome := true;} }}; 

                if(wrong_status_open_state_before != wrong_status_open_state_after){unexpectedOutcome := true;};
                if(wrong_status_pickanswer_state_before != wrong_status_pickanswer_state_after){unexpectedOutcome := true;};
                if(wrong_status_disputable_state_before != wrong_status_disputable_state_after){unexpectedOutcome := true;};
                if(wrong_status_payout_pay_state_before != wrong_status_payout_pay_state_after){unexpectedOutcome := true;};
                if(wrong_status_payout_ongoing_state_before != wrong_status_payout_ongoing_state_after){unexpectedOutcome := true;};
                if(wrong_status_payout_closed_state_before != wrong_status_payout_closed_state_after){unexpectedOutcome := true;};
    
                if(unexpectedOutcome){ "unexpected" } else {"expected state"}

            },
            M.equals<Text>(T.text("expected state"))),


            S.test("incorrect answer id should not work",
             switch(incorrect_answer_id){case(#ok(res)){ "unexpected success" };
                    case(#err(err)){ 
                        if( 
                            err == #AnswerNotFound and 
                            incorrect_answer_id_state_after == base_state
                        ){ "expected error"} else {"unexpected state"};
                    };
                },
            M.equals<Text>(T.text("expected error"))),
             
            S.test("correct state transition if #answer",
             switch(correct_answer_id){case(#err(err)){ "unexpected error" };
                    case(#ok(res)){ 
                        if( 
                            // TODO: more checks
                            correct_answer_id_state_after.questions_state[0].status == #PAYOUT(#PAY) and
                            correct_answer_id_state_after.questions_state[0].finalWinner == ?(#ANSWER({answer_id="0"}))
                        ){ "success"} else {"unexpected state"};
                    };
                },
            M.equals<Text>(T.text("success"))),
           
            S.test("correct state transition if #question",
            switch(right_status_question){case(#err(err)){ "unexpected error" };
                    case(#ok(res)){ 
                        if( 
                            // TODO: more checks
                            right_status_question_state_after.questions_state[0].status == #PAYOUT(#PAY) and
                            right_status_question_state_after.questions_state[0].finalWinner == ?(#QUESTION)
                        ){ "success"} else {"unexpected state"};
                    };
                },
            M.equals<Text>(T.text("success"))),
    
        ]);
        
        S.run(suite);
        return #success;
    };

    public shared func testPayout() : async {#success; #fail : Text} {
         Debug.print("running testPayout");

        let a_user: Test_User.test_user = await  create_test_user();
        let b_user: Test_User.test_user = await  create_test_user();
        let c_user: Test_User.test_user = await  create_test_user();

        let base_state:State = {
            users_state = [
                {
                    id = Principal.fromActor(a_user); 
                    answers = []; 
                    avatar = null; 
                    invoices = [0, 1]; 
                    joined_date: Int32 = Int32.fromInt(Time.now() / 60000000000);
                    name = "John"; 
                    questions = ["0", "1"]
                },
                {
                    id = Principal.fromActor(b_user); 
                    answers = ["0"]; 
                    avatar = null; 
                    invoices = []; 
                    joined_date: Int32 = Int32.fromInt(Time.now() / 60000000000);
                    name = "Tim"; 
                    questions = []
                },
                {
                    id = Principal.fromActor(c_user); 
                    answers = []; 
                    avatar = null; 
                    invoices = []; 
                    joined_date: Int32 = Int32.fromInt(Time.now() / 60000000000);
                    name = "Steve"; 
                    questions = []
                },
            ];
            invoices_state = [
                {
                    id = 0;
                    buyer_id = Principal.fromActor(a_user);
                    question_id = ?"0";
                },
            ];
            questions_state = [
                {
                    id= "0";
                    invoice_id= 0; 
                    author_id= Principal.fromActor(a_user);

                    creation_date: Int32 = Int32.fromInt(Time.now() / 60000000000) +1;
                    open_duration= 2;
                    title = "test question";
                    content = "Predictable state updates: Reducer functions are pure, meaning they don't have side effects and only depend on their input arguments. This makes state updates more predictable and easier to reason about. You can easily understand how the state will change based on the dispatched action without worrying about unintended consequences.";
                    reward = 1_300_000:Int32;
                            
                    status= #PAYOUT(#PAY);
                    status_update_date: Int32 = Int32.fromInt(Time.now() / 60000000000)+1;
                    status_end_date: Int32 = Int32.fromInt(Time.now() / 60000000000)+2;
                    
                    answers = ["0", "1"]; 
                    potentialWinner = ?"0";
                    finalWinner = ?(#ANSWER({answer_id="0"}));
                    close_transaction_block_height= null;
                },
            ];
            answers_state = [
                {
                    id = "0";
                    author_id = Principal.fromActor(b_user);
                    question_id = "0";
                    creation_date: Int32 = Int32.fromInt(Time.now() / 60000000000) +1;
                    content = "Integration with popular libraries: Reducer pattern is popularized by libraries like Redux, which provide additional benefits such as middleware support, devtools integration, and the ability to manage your application's entire state in a single store. This further enhances the advantages of the reducer pattern.";
                },
                {
                    id = "1";
                    author_id = Principal.fromActor(c_user);
                    question_id = "0";
                    creation_date: Int32 = Int32.fromInt(Time.now() / 60000000000) +1;
                    content = "Integration with popular libraries: Reducer pattern is popularized by libraries like Redux, which provide additional benefits such as middleware support, devtools integration, and the ability to manage your application's entire state in a single store. This further enhances the advantages of the reducer pattern.";
                }
            ];
        };

        ignore await market_canister.set_db(base_state:State);

        // no question
        let unknown_question = await market_canister.update_payout("10");
        let unknown_question_state = await market_canister.get_db();

        // wrong status synchronous
        let wrong_status_open_state_before = await market_canister.set_db({ base_state with questions_state = [
            {base_state.questions_state[0] with status = #OPEN },
        ]}: State);
        let wrong_status_open = await market_canister.update_payout("0");
        let wrong_status_open_state_after = await market_canister.get_db();

        let wrong_status_pickanswer_state_before = await market_canister.set_db({ base_state with questions_state = [
            {base_state.questions_state[0] with status = #PICKANSWER },
        ]}: State);
        let wrong_status_pickanswer = await market_canister.update_payout("0");
        let wrong_status_pickanswer_state_after = await market_canister.get_db();

        let wrong_status_disputable_state_before = await market_canister.set_db({ base_state with questions_state = [
            {base_state.questions_state[0] with status = #DISPUTABLE },
        ]}: State);
        let wrong_status_disputable = await market_canister.update_payout("0");
        let wrong_status_disputable_state_after = await market_canister.get_db();

        let wrong_status_arbitration_state_before = await market_canister.set_db({ base_state with questions_state = [
            {base_state.questions_state[0] with status = #ARBITRATION },
        ]}: State);
        let wrong_status_arbitration = await market_canister.update_payout("0");
        let wrong_status_arbitration_state_after = await market_canister.get_db();

        let wrong_status_payout_ongoing_state_before = await market_canister.set_db({ base_state with questions_state = [
            {base_state.questions_state[0] with status = #PAYOUT(#ONGOING) },
        ]}: State);
        let wrong_status_payout_ongoing = await market_canister.update_payout("0");
        let wrong_status_payout_ongoing_state_after = await market_canister.get_db();

        let wrong_status_payout_closed_state_before = await market_canister.set_db({ base_state with questions_state = [
            {base_state.questions_state[0] with status = #CLOSED },
        ]}: State);
        let wrong_status_payout_closed = await market_canister.update_payout("0");
        let wrong_status_payout_closed_state_after = await market_canister.get_db();

        // TODO: for both #answer and #question
        // that the ongoing is put in place and nothing can be called then

        // bombard with 3 calls: first goes through, fetching state gives, others are blocked
        // transfer fails, as it has no funding (print transfer error), final state is PAY again. Assert that no payment happend

        // bombard with 3 calls: first goes through, others are blocked
        // transfer succeeds (market needs funding), final state is 1 payment & correct closing

        // can I get temporary state? -> yes of course I can also get it without awaiting and then later on await it.
       
        //  ------- async blocker tests (failure) -------
        ignore await market_canister.set_db(base_state:State);

        let a = market_canister.update_payout("0");
        let db_ongoing = market_canister.get_db();
        let b_blocked = market_canister.update_payout("0");
        let c_blocked = market_canister.update_payout("0");

        let db_ongoing_awaited = (await db_ongoing).questions_state[0];
        let a_awaited =  await a;
        let b_blocked_awaited =  await b_blocked;
        let c_blocked_awaited =  await c_blocked;
        let db_state_after = await market_canister.get_db();

        // ledger await.noPayment has happened

        //  ------- async blocker tests (failure) -------
        // TODO: rename vars
        // TODO: allow to pass amount
        ignore await market_canister.set_db(base_state:State);
        Debug.print("funding of actor:"# debug_show(await fund_account_on_invoice()));

        let x = market_canister.update_payout("0");
        let db_ongoing_success = market_canister.get_db();

        let y_blocked = market_canister.update_payout("0");
        let z_blocked = market_canister.update_payout("0");

        let db_ongoing_awaited_success = (await db_ongoing_success).questions_state[0];
        let x_awaited_success =  await x;
        let y_blocked_awaited_success =  await y_blocked;
        let z_blocked_awaited_success =  await z_blocked;
        let db_state_after_success = await market_canister.get_db();

        let suite = S.suite("test payout", [
            S.test(
                "question does not exist",
                switch(unknown_question){case(#ok(res)){ "unexpected success" };
                        case(#err(err)){ 
                            if( 
                                err == #QuestionNotFound and 
                                unknown_question_state == base_state
                            ){ "expected error"} else {"unexpected state"};
                        };
                    },
                M.equals<Text>(T.text("expected error"))
            ),
            S.test(
                "wrong synchronous status",
                do {
                    var unexpectedOutcome = false;
                    switch(wrong_status_open){case(#ok(res)){ unexpectedOutcome := true}; case(#err(err)){ if(err != #WrongStatus){unexpectedOutcome := true;} }}; 
                    switch(wrong_status_pickanswer){case(#ok(res)){ unexpectedOutcome := true}; case(#err(err)){ if(err != #WrongStatus){unexpectedOutcome := true;} }}; 
                    switch(wrong_status_disputable){case(#ok(res)){ unexpectedOutcome := true}; case(#err(err)){ if(err != #WrongStatus){unexpectedOutcome := true;} }}; 
                    switch(wrong_status_arbitration){case(#ok(res)){ unexpectedOutcome := true}; case(#err(err)){ if(err != #WrongStatus){unexpectedOutcome := true;} }};
                    switch(wrong_status_payout_closed){case(#ok(res)){ unexpectedOutcome := true}; case(#err(err)){ if(err != #WrongStatus){unexpectedOutcome := true;} }}; 

                    if(wrong_status_open_state_before != wrong_status_open_state_after){unexpectedOutcome := true;};
                    if(wrong_status_pickanswer_state_before != wrong_status_pickanswer_state_after){unexpectedOutcome := true;};
                    if(wrong_status_disputable_state_before != wrong_status_disputable_state_after){unexpectedOutcome := true;};
                    if(wrong_status_arbitration_state_before != wrong_status_arbitration_state_after){unexpectedOutcome := true;};
                    if(wrong_status_payout_closed_state_before != wrong_status_payout_closed_state_after){unexpectedOutcome := true;};
        
                    if(unexpectedOutcome){ "unexpected" } else {"expected state"}
                },
                M.equals<Text>(T.text("expected state"))
            ),
            S.test(
                "async blocker work when transfer fails",
                do {
                    var unexpectedOutcome = false;
                    
                    if(db_ongoing_awaited.status != #PAYOUT(#ONGOING)){unexpectedOutcome := true};                  
                    if(a_awaited != #err(#Failed)){unexpectedOutcome := true};
                    if(b_blocked_awaited != #err(#WrongStatus)){unexpectedOutcome := true};
                    if(c_blocked_awaited != #err(#WrongStatus)){unexpectedOutcome := true};
                    // TODO: status_update_data changes, I would need to ignore that to make it work
                    //if(not (db_state_after == base_state)){unexpectedOutcome := true};

                    // TODO: ledger state
                    if(unexpectedOutcome){ "unexpected" } else {"expected state"}

                },
                M.equals<Text>(T.text("expected state"))
            ),
            S.test(
                "async blockers work when transfer succeeds",

                do {
                    var unexpectedOutcome = false;
                    
                    if(db_ongoing_awaited_success.status != #PAYOUT(#ONGOING)){ unexpectedOutcome := true };                  
                    switch(x_awaited_success){case(#ok(block)){}; case(_){unexpectedOutcome := true}};
                    if(y_blocked_awaited_success != #err(#WrongStatus)){unexpectedOutcome := true};
                    if(z_blocked_awaited_success != #err(#WrongStatus)){unexpectedOutcome := true};

                    let new_question_state = db_state_after_success.questions_state[0];
                    if(not (
                            new_question_state.status == #CLOSED and
                            new_question_state.close_transaction_block_height != null
                    )){unexpectedOutcome := true};

                    // TODO: ledger state
                    if(unexpectedOutcome){ "unexpected" } else {"expected state"}

                },
                M.equals<Text>(T.text("expected state"))
            ),
     
        ]);
        S.run(suite);
        return #success;

    };
    // --------- update functions ---------
    // add several questions that need to be updates?

    // --------- ?heartbeat ---------
    // not sure if I can tests this

    // --------- ?mainnet ---------

    public shared func testQueries() : async {#success; #fail : Text} {
    
        let c_user: Test_User.test_user = await  create_test_user();

        let base_state:State = {
            users_state = [
                {
                    id =  Principal.fromText("tsm3f-vuuza-xfy3b-wcbrx-r4nzg-jy6o2-ydpbq-67lqa-rgq6j-ijkaa-aqe");
                    answers = []; 
                    avatar = null; 
                    invoices = []; 
                    joined_date: Int32 = Int32.fromInt(Time.now() / 60000000000);
                    name = "Author"; 
                    questions = ["10", "20", "30", "40"]
                },
                {
                    id =  Principal.fromText("4x6qx-tmjtk-uzyzt-ihfyt-3xeeg-aml4y-5v64i-v6u3x-scyy2-mobv5-pae"); 
                    answers = []; 
                    avatar = null; 
                    invoices = []; 
                    joined_date: Int32 = Int32.fromInt(Time.now() / 60000000000);
                    name = "Answerer"; 
                    questions = [];
                },
                {
                    id = Principal.fromActor(c_user); 
                    answers = []; 
                    avatar = null; 
                    invoices = [0, 1]; 
                    joined_date: Int32 = Int32.fromInt(Time.now() / 60000000000);
                    name = "Ohter User"; 
                    questions = []
                },        
            ];
            invoices_state = [];
            questions_state = [
           {
                    id= "10";
                    invoice_id= 10; 
                    author_id= Principal.fromText("tsm3f-vuuza-xfy3b-wcbrx-r4nzg-jy6o2-ydpbq-67lqa-rgq6j-ijkaa-aqe");

                    creation_date: Int32 = Int32.fromInt(Time.now() / 60000000000);
                    open_duration= 2;
                    title = "What challenges did you face and what were your key learnings from this?What challenges did you face and what were your key learnings from this?What challenges did you face and what were your key learnings from this?What challenges did you face and what were your key learnings from this?";
                    content = "Predictable state updates: Reducer functions are pure, meaning they don't have side effects and only depend on their input arguments. This makes state updates more predictable and easier to reason about. You can easily understand how the state will change based on the dispatched action without worrying about unintended consequences.";
                    reward = 510000000:Int32;
                            
                    status= #OPEN;
                    status_update_date: Int32 = Int32.fromInt(Time.now() / 60000000000)+1;
                    status_end_date: Int32 = Int32.fromInt(Time.now() / 60000000000)+20;
                    
                    answers = ["11", "12"]; 
                    potentialWinner = null;
                    finalWinner = null;
                    close_transaction_block_height = null;
                    // (#ANSWER({answer_id="0"}));
                },
                 {
                    id= "20";
                    invoice_id= 10; 
                    author_id= Principal.fromText("tsm3f-vuuza-xfy3b-wcbrx-r4nzg-jy6o2-ydpbq-67lqa-rgq6j-ijkaa-aqe");

                    creation_date: Int32 = Int32.fromInt(Time.now() / 60000000000);
                    open_duration= 2;
                    title = "What challenges did you face and what were your key learnings from this?What challenges did you face and what were your key learnings from this?What challenges did you face and what were your key learnings from this?What challenges did you face and what were your key learnings from this?";
                    content = "Predictable state updates: Reducer functions are pure, meaning they don't have side effects and only depend on their input arguments. This makes state updates more predictable and easier to reason about. You can easily understand how the state will change based on the dispatched action without worrying about unintended consequences.";
                    reward = 610000000:Int32;
                            
                    status= #PICKANSWER;
                    status_update_date: Int32 = Int32.fromInt(Time.now() / 60000000000)+1;
                    status_end_date: Int32 = Int32.fromInt(Time.now() / 60000000000)+102;
                    
                    answers = ["21", "22"]; 
                    potentialWinner = null;
                    finalWinner = null;
                    close_transaction_block_height= null;
                }, 
                {
                    id= "30";
                    invoice_id = 20; 
                    author_id = Principal.fromText("tsm3f-vuuza-xfy3b-wcbrx-r4nzg-jy6o2-ydpbq-67lqa-rgq6j-ijkaa-aqe");

                    creation_date: Int32 = Int32.fromInt(Time.now() / 60000000000);
                    open_duration= 1;
                    title = "What challenges did you face and what were your key learnings from this?What challenges did you face and what were your key learnings from this?What challenges did you face and what were your key learnings from this?What challenges did you face and what were your key learnings from this?";
                    content = "Predictable state updates: Reducer functions are pure, meaning they don't have side effects and only depend on their input arguments. This makes state updates more predictable and easier to reason about. You can easily understand how the state will change based on the dispatched action without worrying about unintended consequences.";
                    reward = 710000000:Int32;
                            
                    status= #DISPUTABLE;
                    status_update_date: Int32 = Int32.fromInt(Time.now() / 60000000000)+1;
                    status_end_date: Int32 = Int32.fromInt(Time.now() / 60000000000)+2;
                    
                    answers = ["31","32"]; 
                    potentialWinner = ?"31";
                    finalWinner = null;
                    close_transaction_block_height= null;
                },
                 {
                    id= "40";
                    invoice_id= 30; 
                    author_id= Principal.fromText("tsm3f-vuuza-xfy3b-wcbrx-r4nzg-jy6o2-ydpbq-67lqa-rgq6j-ijkaa-aqe");

                    creation_date: Int32 = Int32.fromInt(Time.now() / 60000000000);
                    open_duration= 2;
                    title = "What challenges did you face and what were your key learnings from this?What challenges did you face and what were your key learnings from this?What challenges did you face and what were your key learnings from this?What challenges did you face and what were your key learnings from this?";
                    content = "Predictable state updates: Reducer functions are pure, meaning they don't have side effects and only depend on their input arguments. This makes state updates more predictable and easier to reason about. You can easily understand how the state will change based on the dispatched action without worrying about unintended consequences.";
                    reward = 510000000:Int32;
                            
                    status= #ARBITRATION;
                    status_update_date: Int32 = Int32.fromInt(Time.now() / 60000000000)+1;
                    status_end_date: Int32 = Int32.fromInt(Time.now() / 60000000000)+2;
                    
                    answers = ["41","42"]; 
                    potentialWinner = ?"41";
                    finalWinner = ?(#ANSWER({answer_id="41"}));
                    close_transaction_block_height= null;
                }, 
                /* Further */
                  {
                    id= "50";
                    invoice_id= 30; 
                    author_id= Principal.fromText("tsm3f-vuuza-xfy3b-wcbrx-r4nzg-jy6o2-ydpbq-67lqa-rgq6j-ijkaa-aqe");

                    creation_date: Int32 = Int32.fromInt(Time.now() / 60000000000);
                    open_duration= 2;
                    title = "What challenges did you face and what were your key learnings from this?What challenges did you face and what were your key learnings from this?What challenges did you face and what were your key learnings from this?What challenges did you face and what were your key learnings from this?";
                    content = "Predictable state updates: Reducer functions are pure, meaning they don't have side effects and only depend on their input arguments. This makes state updates more predictable and easier to reason about. You can easily understand how the state will change based on the dispatched action without worrying about unintended consequences.";
                    reward = 510000000:Int32;
                            
                    status=  #OPEN;
                    status_update_date: Int32 = Int32.fromInt(Time.now() / 60000000000)+1;
                    status_end_date: Int32 = Int32.fromInt(Time.now() / 60000000000)+2;
                    
                    answers = []; 
                    potentialWinner = null;
                    finalWinner = null;
                    close_transaction_block_height= null;
                }, 
                  {
                    id= "60";
                    invoice_id= 30; 
                    author_id= Principal.fromText("tsm3f-vuuza-xfy3b-wcbrx-r4nzg-jy6o2-ydpbq-67lqa-rgq6j-ijkaa-aqe");

                    creation_date: Int32 = Int32.fromInt(Time.now() / 60000000000);
                    open_duration= 2;
                    title = "What challenges did you face and what were your key learnings from this?What challenges did you face and what were your key learnings from this?What challenges did you face and what were your key learnings from this?What challenges did you face and what were your key learnings from this?";
                    content = "Predictable state updates: Reducer functions are pure, meaning they don't have side effects and only depend on their input arguments. This makes state updates more predictable and easier to reason about. You can easily understand how the state will change based on the dispatched action without worrying about unintended consequences.";
                    reward = 510000000:Int32;
                            
                    status=  #OPEN;
                    status_update_date: Int32 = Int32.fromInt(Time.now() / 60000000000)+1;
                    status_end_date: Int32 = Int32.fromInt(Time.now() / 60000000000)+2;
                    
                    answers = []; 
                    potentialWinner = null;
                    finalWinner = null;
                    close_transaction_block_height= null;
                }, 
                  {
                    id= "70";
                    invoice_id= 30; 
                    author_id= Principal.fromText("tsm3f-vuuza-xfy3b-wcbrx-r4nzg-jy6o2-ydpbq-67lqa-rgq6j-ijkaa-aqe");

                    creation_date: Int32 = Int32.fromInt(Time.now() / 60000000000);
                    open_duration= 2;
                    title = "What challenges did you face and what were your key learnings from this?What challenges did you face and what were your key learnings from this?What challenges did you face and what were your key learnings from this?What challenges did you face and what were your key learnings from this?";
                    content = "Predictable state updates: Reducer functions are pure, meaning they don't have side effects and only depend on their input arguments. This makes state updates more predictable and easier to reason about. You can easily understand how the state will change based on the dispatched action without worrying about unintended consequences.";
                    reward = 510000000:Int32;
                            
                    status= #OPEN;
                    status_update_date: Int32 = Int32.fromInt(Time.now() / 60000000000)+1;
                    status_end_date: Int32 = Int32.fromInt(Time.now() / 60000000000)+2;
                    
                    answers = []; 
                    potentialWinner = null;
                    finalWinner = null;
                    close_transaction_block_height= null;
                }, 
                  {
                    id= "80";
                    invoice_id= 30; 
                    author_id= Principal.fromText("tsm3f-vuuza-xfy3b-wcbrx-r4nzg-jy6o2-ydpbq-67lqa-rgq6j-ijkaa-aqe");

                    creation_date: Int32 = Int32.fromInt(Time.now() / 60000000000);
                    open_duration= 2;
                    title = "What challenges did you face and what were your key learnings from this?What challenges did you face and what were your key learnings from this?What challenges did you face and what were your key learnings from this?What challenges did you face and what were your key learnings from this?";
                    content = "Predictable state updates: Reducer functions are pure, meaning they don't have side effects and only depend on their input arguments. This makes state updates more predictable and easier to reason about. You can easily understand how the state will change based on the dispatched action without worrying about unintended consequences.";
                    reward = 510000000:Int32;
                            
                    status= #OPEN;
                    status_update_date: Int32 = Int32.fromInt(Time.now() / 60000000000)+1;
                    status_end_date: Int32 = Int32.fromInt(Time.now() / 60000000000)+2;
                    
                    answers = []; 
                    potentialWinner = null;
                    finalWinner = null;
                    close_transaction_block_height= null;
                }, 
                  
            ];
            answers_state = [
                {
                    id = "11";
                    author_id = Principal.fromText("4x6qx-tmjtk-uzyzt-ihfyt-3xeeg-aml4y-5v64i-v6u3x-scyy2-mobv5-pae"); 
                    question_id = "10";
                    creation_date: Int32 = Int32.fromInt(Time.now() / 60000000000);
                    content = "Integration with popular libraries: Reducer pattern is popularized by libraries like Redux, which provide additional benefits such as middleware support, devtools integration, and the ability to manage your application's entire state in a single store. This further enhances the advantages of the reducer pattern.";
                },
                {
                    id = "12";
                    author_id =  Principal.fromActor(c_user);
                    question_id = "10";
                    creation_date: Int32 = Int32.fromInt(Time.now() / 60000000000);
                    content = "Integration with popular libraries: Reducer pattern is popularized by libraries like Redux, which provide additional benefits such as middleware support, devtools integration, and the ability to manage your application's entire state in a single store. This further enhances the advantages of the reducer pattern.";
                },

                {
                    id = "21";
                    author_id = Principal.fromText("4x6qx-tmjtk-uzyzt-ihfyt-3xeeg-aml4y-5v64i-v6u3x-scyy2-mobv5-pae"); 
                    question_id = "20";
                    creation_date: Int32 = Int32.fromInt(Time.now() / 60000000000);
                    content = "Integration with popular libraries: Reducer pattern is popularized by libraries like Redux, which provide additional benefits such as middleware support, devtools integration, and the ability to manage your application's entire state in a single store. This further enhances the advantages of the reducer pattern.";
                },
                {
                    id = "22";
                    author_id =  Principal.fromActor(c_user);
                    question_id = "20";
                    creation_date: Int32 = Int32.fromInt(Time.now() / 60000000000);
                    content = "Integration with popular libraries: Reducer pattern is popularized by libraries like Redux, which provide additional benefits such as middleware support, devtools integration, and the ability to manage your application's entire state in a single store. This further enhances the advantages of the reducer pattern.";
                },

                {
                    id = "31";
                    author_id = Principal.fromText("4x6qx-tmjtk-uzyzt-ihfyt-3xeeg-aml4y-5v64i-v6u3x-scyy2-mobv5-pae"); 
                    question_id = "30";
                    creation_date: Int32 = Int32.fromInt(Time.now() / 60000000000);
                    content = "Integration with popular libraries: Reducer pattern is popularized by libraries like Redux, which provide additional benefits such as middleware support, devtools integration, and the ability to manage your application's entire state in a single store. This further enhances the advantages of the reducer pattern.";
                },
                {
                    id = "32";
                    author_id =  Principal.fromActor(c_user);
                    question_id = "30";
                    creation_date: Int32 = Int32.fromInt(Time.now() / 60000000000);
                    content = "Integration with popular libraries: Reducer pattern is popularized by libraries like Redux, which provide additional benefits such as middleware support, devtools integration, and the ability to manage your application's entire state in a single store. This further enhances the advantages of the reducer pattern.";
                },

                {
                    id = "41";
                    author_id = Principal.fromText("4x6qx-tmjtk-uzyzt-ihfyt-3xeeg-aml4y-5v64i-v6u3x-scyy2-mobv5-pae"); 
                    question_id = "40";
                    creation_date: Int32 = Int32.fromInt(Time.now() / 60000000000);
                    content = "Integration with popular libraries: Reducer pattern is popularized by libraries like Redux, which provide additional benefits such as middleware support, devtools integration, and the ability to manage your application's entire state in a single store. This further enhances the advantages of the reducer pattern.";
                },
                {
                    id = "42";
                    author_id =  Principal.fromActor(c_user);
                    question_id = "40";
                    creation_date: Int32 = Int32.fromInt(Time.now() / 60000000000);
                    content = "Integration with popular libraries: Reducer pattern is popularized by libraries like Redux, which provide additional benefits such as middleware support, devtools integration, and the ability to manage your application's entire state in a single store. This further enhances the advantages of the reducer pattern.";
                }
            ];
        };

        ignore await market_canister.set_db(base_state:State);
        
        /* let res = await market_canister.get_conditional_questions({
            open= true; pickanswer= true; disputable= true; arbitration= true; payout= true; closed= true; }
        , #REWARD); */

        
       // let res = await market_canister.get_users([]);
        //Debug.print("empty data:     " # debug_show(res));

        //let res1 = await market_canister.get_users([Principal.fromActor(c_user)]);
        //Debug.print("data:     " # debug_show(res1));

        //let res2 = await market_canister.get_question_data("10");
        //Debug.print("question data:     " # debug_show(res2));

        ignore await fund_principal(Principal.fromText("tsm3f-vuuza-xfy3b-wcbrx-r4nzg-jy6o2-ydpbq-67lqa-rgq6j-ijkaa-aqe"));

        /* Debug.print("0 :     " # debug_show(await market_canister.get_conditional_questions({open= true; pickanswer= true; disputable= true; arbitration= true; payout= true; closed= true; }, #REWARD, 0, 10 )));
        Debug.print("1 :     " # debug_show(await market_canister.get_conditional_questions({open= true; pickanswer= true; disputable= true; arbitration= true; payout= true; closed= true; }, #REWARD, 1, 10 )));
        Debug.print("2 :     " # debug_show(await market_canister.get_conditional_questions({open= true; pickanswer= true; disputable= true; arbitration= true; payout= true; closed= true; }, #REWARD, 2, 10 )));
        Debug.print("3 :     " # debug_show(await market_canister.get_conditional_questions({open= true; pickanswer= true; disputable= true; arbitration= true; payout= true; closed= true; }, #REWARD, 3, 10 )));
        Debug.print("4 :     " # debug_show(await market_canister.get_conditional_questions({open= true; pickanswer= true; disputable= true; arbitration= true; payout= true; closed= true; }, #REWARD, 4, 10 )));
        Debug.print("5 :     " # debug_show(await market_canister.get_conditional_questions({open= true; pickanswer= true; disputable= true; arbitration= true; payout= true; closed= true; }, #REWARD, 5, 10 ))); */

        /* Debug.print("0, 0 :     " # debug_show(await market_canister.get_conditional_questions({open= true; pickanswer= true; disputable= true; arbitration= true; payout= true; closed= true; }, #REWARD, 0, 0 )));
        Debug.print("0, 1 :     " # debug_show(await market_canister.get_conditional_questions({open= true; pickanswer= true; disputable= true; arbitration= true; payout= true; closed= true; }, #REWARD, 0, 1 )));
        Debug.print("0, 2 :     " # debug_show(await market_canister.get_conditional_questions({open= true; pickanswer= true; disputable= true; arbitration= true; payout= true; closed= true; }, #REWARD, 0, 2 )));
        Debug.print("0, 3 :     " # debug_show(await market_canister.get_conditional_questions({open= true; pickanswer= true; disputable= true; arbitration= true; payout= true; closed= true; }, #REWARD, 0, 3 )));
        Debug.print("0, 4 :     " # debug_show(await market_canister.get_conditional_questions({open= true; pickanswer= true; disputable= true; arbitration= true; payout= true; closed= true; }, #REWARD, 0, 4 )));
        Debug.print("0, 5 :     " # debug_show(await market_canister.get_conditional_questions({open= true; pickanswer= true; disputable= true; arbitration= true; payout= true; closed= true; }, #REWARD, 0, 5 )));
        Debug.print("0, 6 :     " # debug_show(await market_canister.get_conditional_questions({open= true; pickanswer= true; disputable= true; arbitration= true; payout= true; closed= true; }, #REWARD, 0, 6 )));  */

        //Debug.print("0, 10 :     " # debug_show(await market_canister.get_conditional_questions_with_authors({open= true; pickanswer= true; disputable= true; arbitration= true; payout= true; closed= true; }, #REWARD, 0, 10 )));
        //Debug.print("db :     " # debug_show((await market_canister.get_db())).questions_state);


        let suite = S.suite("queries", [
            S.test(
                "",
                "",
                M.equals<Text>(T.text(""))
            ),
        ]);
        
        S.run(suite);
        return #success;
    };
};
   
