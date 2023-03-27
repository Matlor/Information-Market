import InvoiceTypes "../invoice/types";
import Result       "mo:base/Result";

// TO DO: paste directly the types used from the invoice canister here
// TO DO: check if it makes more sense to have more detailed errors, or one
// TO DO: how should the errors be bubbled up from the invoice canister?
// type of error per function
module {

    // TODO: possibly modify
    public type Sort_Options = {
        #REWARD: { #ASCD; #DESCD };
        #TIME_LEFT: { #ASCD; #DESCD };
    };

    public type Filter_Options = {
        open: Bool;
        pickanswer: Bool;
        disputable: Bool;
        arbitration: Bool;
        payout: Bool;
        closed: Bool;
    };

    // TODO: rename (state for example)
    public type State = {
        users_state: [User];
        invoices_state: [Invoice];
        questions_state: [Question];
        answers_state: [Answer];
    };

    /*  public type Error = {
        #NotFound;
        #NotAllowed;
        #WrongStatus;
        #GraphQLError;
        // TO DO: somehow the VerifyInvoiceErr from the InvoiceTypes is not present 
        // at compilation even if it is defined in invoice_types.mo file
        #VerifyInvoiceError; //: InvoiceTypes.VerifyInvoiceErr;
        #AccountIdentifierError;
        #TransferError: InvoiceTypes.TransferError;
        #UserNotFound;
        #UserExists;
        #WrongPrincipal;
        #UnpaidReward;
    }; */

    // TODO: should I have more or less descriptive errors?
    public type StateError = {
        #UserExists;
        #UserNotFound;
        #UserIsInvalid;
        #InvoiceExists;
        #InvoiceNotFound;
        #InvoiceIsInvalid;
        #QuestionExists;
        #QuestionNotFound;
        #AnswerExists;
        #AnswerNotFound;
        #AnswerQuestionMismatch;
        #WinnerNotFound;
        #VerifyInvoiceError; //: TODO: InvoiceTypes.VerifyInvoiceErr;
        #AccountIdentifierError; //: TODO
        #TransferError: InvoiceTypes.TransferError; //: TODO

        // TO DO: NotAllowed might be a bad error
        #NotAllowed;
        #WrongStatus;

        #Failed;

    };
    
    // TODO: always refer to as user_id instead of id across the app
    // TODO: why should ids be text? due to hash?
    // experiment: I took this out from the user: avatar: ?Blob;
    public type User = {
        id: Principal;
        name: Text;
        joined_date: Int32;
        invoices: [Nat];  // relation to invoice
        questions: [Text]; // relation to user
        answers: [Text];   // relation to answer
    };

    public type Profile = ?Blob;

    // TODO: maybe rename buyer_id to 'creator' as on invoice canister
    // TODO: rename this type to reduce confusion with invoice canister
    // TODO: rename the invoice type from the invoice canister to InvoiceCanister.Invoice
    // TODO: always refer to as invoice_id instead of id across the app
    public type Invoice = {
        id: Nat;
        buyer_id: Principal; // relation to user 
        question_id: ?Text;  // relation to question
    };

    public type QuestionStatus =  {
        #OPEN;
        #PICKANSWER;
        #DISPUTABLE;
        #ARBITRATION;

        // final winner
        #PAYOUT: {#PAY; #ONGOING };
        #CLOSED;
        // closed could contain more variables than open to reflect the decisions
    };

    public type FinalWinner = {
        #ANSWER: {answer_id: Text};
        #QUESTION;
    };

    // TODO: Changed from Int32 to int check if we have int32 due to graphql
    // TODO: reward needs to be Int32 due to invoice canister
    // TODO: always refer to as question_id instead of id across the app
    // reward should be Int32 as it is smaller than Nat. Invoice takes Nat and ledger Int32. From Int32 to Nat is safe
    // TODO: check where Int32 is possible to be taken, it converts to a number on the frontend
    public type Question = {
        id: Text;
        author_id: Principal; // relation to user
        invoice_id: Nat; // relation to invoice
        creation_date: Int32;
        title: Text;
        content: Text;
        reward: Int32;


        // Could be 1 type?
        status_update_date: Int32;
        status_end_date: Int32;
        open_duration: Int32; // could be replaced by status_end_date
        status: QuestionStatus;
      
        answers: [Text]; // relation to answer
        potentialWinner: ?Text; // relation to user -> TODO: should this be answer or to user?
        
        finalWinner: ?FinalWinner;
        close_transaction_block_height: ?Nat64;
    };
    
    // TODO: always refer to as answer_id instead of id across the app
    public type Answer = {
        id: Text;
        author_id: Principal; // relation to user
        question_id: Text; // relation to question
        creation_date: Int32;
        content: Text;
    };

    // TODO:
    public type AdminType =  {
        id: Text;
        principal: Text;
    };

    // ---------------------------------------
    public type InstallMarketArguments = {
        invoice_canister: Principal;
        coin_symbol: Text;
        min_reward_e8s: Nat;
        transfer_fee_e8s: Nat;
        pick_answer_duration_minutes: Int32;
        disputable_duration_minutes: Int32;
        update_status_on_heartbeat: Bool;
    };

    // TODO: changed min reward and transfer_fee_e8s from Nat to Int32, check of that is ok
    public type UpdateMarketParams = {
        min_reward_e8s: ?Nat;
        transfer_fee_e8s: ?Nat;
        pick_answer_duration_minutes: ?Int32;
        disputable_duration_minutes: ?Int32;
    };

    // --------------- TODO: IMPROVE THIS------------------------   
    // TODO: this needs to be manually changed atm
    public type Interface = actor {
       
        answer_question: (Text, Text) -> async (Result.Result<Answer, StateError>);
        arbitrate: (Text, FinalWinner) -> async (Result.Result<(), StateError>);
        ask_question: (Nat, Nat, Text, Text) -> async (Result.Result<Question, StateError>);
        create_invoice: (Nat) -> async (InvoiceTypes.CreateInvoiceResult);
        create_user: (Text) -> async(Result.Result<User, StateError>);
        dispute: (Text) -> async (Result.Result<(), StateError>);
        
        pick_answer: (Text, Text) -> async (Result.Result<(), StateError>);
        update_disputable: (Text) -> async ();
        update_market_params: (UpdateMarketParams) -> async (Result.Result<(), StateError>);
        update_open: (Text) -> async ();
        update_payout: (Text) -> async (Result.Result<Nat64, StateError>);
        update_pick_answer: (Text) -> async ();
        set_db: (State) -> async (State);

        get_db: query() -> async (State);
        get_coin_symbol: query() ->  async (Text);
        get_duration_disputable: query() -> async (Int32);
        get_duration_pick_answer: query() -> async (Int32);
        get_fee: query() -> async (Nat);
        get_min_reward: query() -> async (Nat);
        get_update_status_on_heartbeat: query() -> async (Bool);

        get_user: query (Principal) ->  async (?User);
        get_users: query([Principal]) -> async ([User]);
        get_question_data: query(Text) -> async (?{question:Question; users:[User]; answers:[Answer]} );
        get_conditional_questions: query(Filter_Options, Text, Sort_Options, Nat32, Nat32) -> async ([Question]);
        get_conditional_questions_with_authors: query(Filter_Options, Text, ?Principal, Sort_Options, Nat32, Nat32) -> async ({data:[{question:Question; author:User}]; num_questions:Nat32});

        get_profile: query(Principal) -> async (?Profile);

        // TODO: test this
        update_user: (Text) -> async (Result.Result<User, StateError>);
        update_profile:(Blob) -> async (Result.Result<?Blob, StateError>);

        update_status: () -> async ();
        // TODO: delete this
        who_am_i: () -> async ();
        exp: () -> async (Text);
        
    };

    
}