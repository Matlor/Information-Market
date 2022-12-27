import InvoiceTypes "../invoice/types";
import Result       "mo:base/Result";


// TO DO: paste directly the types used from the invoice canister here
// TO DO: check if it makes more sense to have more detailed errors, or one
// TO DO: how should the errors be bubbled up from the invoice canister?
// type of error per function
module {

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
    public type User = {
        id: Principal;
        name: Text;
        joined_date: Int;
        avatar: ?Blob;
        invoices: [Nat];  // relation to invoice
        questions: [Text]; // relation to user
        answers: [Text];   // relation to answer
    };

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
        #PAYOUT: {#PAY; #ONGOING };
        #CLOSED;
    };

    public type FinalWinner = {
        #ANSWER: {answer_id: Text};
        #QUESTION;
    };

    // TODO: Changed from Int32 to int check if we have int32 due to graphql
    // TODO: reward needs to be Int32 due to invoice canister
    // TODO: always refer to as question_id instead of id across the app
    // reward should be Int32 as it is smaller than Nat. Invoice takes Nat and ledger Int32. From Int32 to Nat is safe
    public type Question = {
        id: Text;
        author_id: Principal; // relation to user
        invoice_id: Nat; // relation to invoice
        creation_date: Int;
        status: QuestionStatus;
        status_update_date: Int;
        status_end_date: Int;
        open_duration: Int;
        title: Text;
        content: Text;
        reward: Int32;
        potentialWinner: ?Text; // relation to user -> TODO: should this be answer or to user?
        finalWinner: ?FinalWinner;
        close_transaction_block_height: ?Nat64;
        answers: [Text]; // relation to answer
    };
    
    // TODO: always refer to as answer_id instead of id across the app
    public type Answer = {
        id: Text;
        author_id: Principal; // relation to user
        question_id: Text; // relation to question
        creation_date: Int;
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
        pick_answer_duration_minutes: Nat;
        disputable_duration_minutes: Nat;
        update_status_on_heartbeat: Bool;
    };

    public type UpdateMarketParams = {
        min_reward_e8s: ?Nat;
        transfer_fee_e8s: ?Nat;
        pick_answer_duration_minutes: ?Int;
        disputable_duration_minutes: ?Int;
    };

    // --------------- TODO: IMPROVE THIS------------------------   
    // TODO: this needs to be manually changed atm
    public type Interface = actor {
        get_user: (Principal) -> async (?User);
        answer_question: (Text, Text) -> async (Result.Result<Answer, StateError>);
        arbitrate: (Text, FinalWinner) -> async (Result.Result<(), StateError>);
        ask_question: (Nat, Nat, Text, Text) -> async (Result.Result<Question, StateError>);
        create_invoice: (Nat) -> async (InvoiceTypes.CreateInvoiceResult);
        create_user: (Text) -> async(Result.Result<User, StateError>);
        dispute: (Text) -> async (Result.Result<(), StateError>);
        get_coin_symbol: () ->  async (Text);
        get_db: () -> async (State);
        get_duration_disputable: () -> async (Int);
        get_duration_pick_answer: () -> async (Int);
        get_fee: () -> async (Nat);
        get_min_reward: () -> async (Nat);
        get_update_status_on_heartbeat: () -> async (Bool);
        pick_answer: (Text, Text) -> async (Result.Result<(), StateError>);
        set_db: (State) -> async (State);
        update_disputable: (Text) -> async ();
        update_market_params: (UpdateMarketParams) -> async (Result.Result<(), StateError>);
        update_open: (Text) -> async ();
        update_payout: (Text) -> async (Result.Result<Nat64, StateError>);
        update_pick_answer: (Text) -> async ();

        // TODO: delete this
        who_am_i: () -> async ();
        exp: () -> async (Text);
    };

    
}