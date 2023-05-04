import Result       "mo:base/Result";
import Time         "mo:base/Time";
import LedgerTypes  "../ledger/ledgerTypes";

module {

    public type Error = {
        #UserExists;
        #UserNotFound;
        #UserIsInvalid;
        #InvoiceNotFound;
        #InvoiceAlreadyVerified;
        #InvoiceNotPaid;
        #BelowMinReward;
        #QuestionExists;
        #QuestionNotFound;
        #AnswerExists;
        #AnswerNotFound;
        #AnswerQuestionMismatch;
        #VerifyInvoiceError;
        #TransferError: LedgerTypes.TransferError;
        #NotAllowed;
        #WrongStatus;
        #Failed;
    };

    // -------------- User Management --------------
    // TODO: always refer to as user_id instead of id across the app
    // TODO: why should ids be text? due to hash?
    // experiment: I took this out from the user: avatar: ?Blob;
    public type User = {
        id: Principal;
        joined_date: Int32;
        invoices: [Nat32];  // relation to invoice
        questions: [Nat32]; // relation to user
        answers: [Nat32];   // relation to answer
    };

    // -------------- Main Entities --------------
    public type Invoice = {
        id: Nat32;
        buyer_id: Principal; 
        question_id: ?Nat32;
        amount: Nat32;
        verifiedAtTime: ?Time.Time;
        paid: Bool;
        destination: Blob;  
        subAccount: Blob;
    };

    // TODO: Changed from Int32 to int check if we have int32 due to graphql
    // TODO: reward needs to be Int32 due to invoice canister
    // TODO: always refer to as question_id instead of id across the app
    // reward should be Int32 as it is smaller than Nat. Invoice takes Nat and ledger Int32. From Int32 to Nat is safe
    // TODO: check where Int32 is possible to be taken, it converts to a number on the frontend
    // status stuff could be 1 type
    // could open_duration be replaced by status_end_date?
    // TODO: should potentialWinner be answer or to user?
    public type Question = {
        id: Nat32;
        author_id: Principal; // relation to user
        invoice_id: Nat32; 
        creation_date: Int32;
        title: Text;
        content: Text;
        reward: Nat32;
        status_update_date: Int32;
        status_end_date: Int32;
        open_duration: Int32; 
        status: QuestionStatus;
        answers: [Nat32]; 
        potentialWinner: ?Nat32; 
        finalWinner: ?FinalWinner;
        close_transaction_block_height: ?Nat64;
    };

    // closed could contain more variables than open to reflect the decisions
    public type QuestionStatus =  {
        #OPEN;
        #PICKANSWER;
        #DISPUTABLE;
        #ARBITRATION;
        #PAYOUT: {#PAY; #ONGOING };
        #CLOSED;
    };

    public type FinalWinner = {
        #ANSWER: {answer_id: Nat32};
        #QUESTION;
    };

    // TODO: always refer to as answer_id instead of id across the app
    public type Answer = {
        id: Nat32;
        author_id: Principal; 
        question_id: Nat32; 
        creation_date: Int32;
        content: Text;
    };

    public type State = {
        users_state: [User];
        invoices_state: [Invoice];
        questions_state: [Question];
        answers_state: [Answer];
    };

    // -------------- Queries --------------
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

    // ---------------------------------------
    public type InstallMarketArguments = {
        ledger_canister: Principal;
        min_reward_e8s: Nat32;
        transfer_fee_e8s: Nat32;
        pick_answer_duration_minutes: Int32;
        disputable_duration_minutes: Int32;
        update_status_on_heartbeat: Bool;
    };

    // TODO: changed min reward and transfer_fee_e8s from Nat to Int32, check of that is ok
    public type UpdateMarketParams = {
        min_reward_e8s: ?Nat32;
        transfer_fee_e8s: ?Nat32;
        pick_answer_duration_minutes: ?Int32;
        disputable_duration_minutes: ?Int32;
    };


    // DELETE
    type Measurment = {
        time: Time.Time;
        name: Text;
    };

    // --------------- TODO: IMPROVE THIS------------------------   
    // TODO: this needs to be manually changed atm
    public type Interface = actor {
        set_db: (State) -> async (Result.Result<State, Error>);
        get_db: query() -> async (Result.Result<State, Error>);

        answer_question: (Text, Text) -> async (Result.Result<Answer, Error>);
        arbitrate: (Text, FinalWinner) -> async (Result.Result<(), Error>);
        ask_question: (Nat32, Int32, Text, Text) -> async (Result.Result<Question, Error>);
        create_invoice: (Nat32) -> async (Result.Result<Invoice, Error>);
        verify_invoice: (Nat32) -> async (Result.Result<Invoice, Error>);

        create_user: (Text) -> async(Result.Result<User, Error>);
        dispute: (Text) -> async (Result.Result<(), Error>);
        pick_answer: (Text, Text) -> async (Result.Result<(), Error>);
        update_disputable: (Text) -> async ();
        update_market_params: (UpdateMarketParams) -> async (Result.Result<(), Error>);
        update_open: (Text) -> async ();
        update_payout: (Text) -> async (Result.Result<Nat64, Error>);
        update_pick_answer: (Text) -> async ();

        get_invoice: (Nat32) -> async (Result.Result<Invoice, Error>);
        get_duration_disputable: query() -> async (Int32);
        get_duration_pick_answer: query() -> async (Int32);
        get_fee: query() -> async (Nat32);
        get_min_reward: query() -> async (Nat32);
        get_update_status_on_heartbeat: query() -> async (Bool);

        get_user: query (Principal) ->  async (?User);
        get_users: query([Principal]) -> async ([User]);
        get_question_data: query(Text) -> async (?{question:Question; users:[User]; answers:[Answer]} );
        get_conditional_questions: query(Filter_Options, Text, Sort_Options, Nat32, Nat32) -> async ([Question]);
        get_conditional_questions_with_authors: query(Filter_Options, Text, ?Principal, Sort_Options, Nat32, Nat32) -> async ({data:[{question:Question; author:User}]; num_questions:Nat32});

        update_user: (Text) -> async (Result.Result<User, Error>);

        update_status: () -> async ();      

        get_measurements:() -> async ([Measurment]);
        get:() -> async (Nat64);

    };
};