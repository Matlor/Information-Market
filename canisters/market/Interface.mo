// This is a generated Motoko binding.
// Please use `import service "ic:canister_id"` instead to call canisters on the IC if possible.

module {
  public type Answer = {
    id : Nat32;
    content : Text;
    author_id : Principal;
    question_id : Nat32;
    creation_date : Int32;
  };
  public type BlockIndex = Nat64;
  public type Error = {
    #UserIsInvalid;
    #AnswerNotFound;
    #Failed;
    #TransferError : TransferError;
    #NotAllowed;
    #QuestionNotFound;
    #VerifyInvoiceError;
    #WrongStatus;
    #InvoiceAlreadyVerified;
    #AnswerExists;
    #QuestionExists;
    #UserExists;
    #InvoiceNotFound;
    #InvoiceNotPaid;
    #BelowMinReward;
    #AnswerQuestionMismatch;
    #UserNotFound;
  };
  public type Filter_Options = {
    closed : Bool;
    arbitration : Bool;
    open : Bool;
    disputable : Bool;
    pickanswer : Bool;
    payout : Bool;
  };
  public type FinalWinner = { #ANSWER : { answer_id : Nat32 }; #QUESTION };
  public type InstallMarketArguments = {
    disputable_duration_minutes : Int32;
    min_reward_e8s : Nat32;
    update_status_on_heartbeat : Bool;
    pick_answer_duration_minutes : Int32;
    transfer_fee_e8s : Nat32;
    ledger_canister : Principal;
  };
  public type Invoice = {
    id : Nat32;
    destination : [Nat8];
    subAccount : [Nat8];
    paid : Bool;
    verifiedAtTime : ?Time;
    question_id : ?Nat32;
    buyer_id : Principal;
    amount : Nat32;
  };
  public type Market = actor {
    answer_question : shared (Nat32, Text) -> async Result_6;
    arbitrate : shared (Nat32, FinalWinner) -> async Result_2;
    ask_question : shared (Nat32, Int32, Text, Text) -> async Result_5;
    create_invoice : shared Nat32 -> async Result;
    create_user : shared () -> async Result_4;
    dispute : shared Nat32 -> async Result_2;
    get : shared () -> async Nat64;
    get_balance : shared () -> async Token;
    get_conditional_questions : shared query (
        Filter_Options,
        Text,
        Sort_Options,
        Nat32,
        Nat32,
      ) -> async [Question];
    get_conditional_questions_with_authors : shared query (
        Filter_Options,
        Text,
        ?Principal,
        Sort_Options,
        Nat32,
        Nat32,
      ) -> async {
        data : [{ question : Question; author : User }];
        num_questions : Nat32;
      };
    get_controllers : shared () -> async [Principal];
    get_db : shared () -> async Result_3;
    get_duration_disputable : shared query () -> async Int32;
    get_duration_pick_answer : shared query () -> async Int32;
    get_fee : shared query () -> async Nat32;
    get_invoice : shared Nat32 -> async Result;
    get_measurements : shared () -> async [Measurment];
    get_min_reward : shared query () -> async Nat32;
    get_question_data : shared query Nat32 -> async ?{
        question : Question;
        answers : [Answer];
        users : [User];
      };
    get_update_status_on_heartbeat : shared query () -> async Bool;
    get_user : shared query Principal -> async ?User;
    get_users : shared query [Principal] -> async [User];
    pick_answer : shared (Nat32, Nat32) -> async Result_2;
    set_db : shared State -> async Result_3;
    update_disputable : shared Nat32 -> async ();
    update_market_params : shared UpdateMarketParams -> async Result_2;
    update_open : shared Nat32 -> async ();
    update_payout : shared Nat32 -> async Result_1;
    update_pick_answer : shared Nat32 -> async ();
    update_status : shared () -> async ();
    verify_invoice : shared Nat32 -> async Result;
  };
  public type Measurment = { name : Text; time : Time };
  public type Question = {
    id : Nat32;
    status : QuestionStatus;
    reward : Nat32;
    title : Text;
    content : Text;
    invoice_id : Nat32;
    answers : [Nat32];
    status_end_date : Int32;
    status_update_date : Int32;
    finalWinner : ?FinalWinner;
    author_id : Principal;
    close_transaction_block_height : ?Nat64;
    open_duration : Int32;
    potentialWinner : ?Nat32;
    creation_date : Int32;
  };
  public type QuestionStatus = {
    #ARBITRATION;
    #OPEN;
    #DISPUTABLE;
    #PICKANSWER;
    #PAYOUT : { #PAY; #ONGOING };
    #CLOSED;
  };
  public type Result = { #ok : Invoice; #err : Error };
  public type Result_1 = { #ok : Nat64; #err : Error };
  public type Result_2 = { #ok; #err : Error };
  public type Result_3 = { #ok : State; #err : Error };
  public type Result_4 = { #ok : User; #err : Error };
  public type Result_5 = { #ok : Question; #err : Error };
  public type Result_6 = { #ok : Answer; #err : Error };
  public type Sort_Options = {
    #TIME_LEFT : { #ASCD; #DESCD };
    #REWARD : { #ASCD; #DESCD };
  };
  public type State = {
    users_state : [User];
    invoices_state : [Invoice];
    questions_state : [Question];
    answers_state : [Answer];
  };
  public type Time = Int;
  public type Token = { e8s : Nat64 };
  public type TransferError = {
    #TxTooOld : { allowed_window_nanos : Nat64 };
    #BadFee : { expected_fee : Token };
    #TxDuplicate : { duplicate_of : BlockIndex };
    #TxCreatedInFuture;
    #InsufficientFunds : { balance : Token };
  };
  public type UpdateMarketParams = {
    disputable_duration_minutes : ?Int32;
    min_reward_e8s : ?Nat32;
    pick_answer_duration_minutes : ?Int32;
    transfer_fee_e8s : ?Nat32;
  };
  public type User = {
    id : Principal;
    joined_date : Int32;
    answers : [Nat32];
    invoices : [Nat32];
    questions : [Nat32];
  };
  public type Self = InstallMarketArguments -> async Market
}
