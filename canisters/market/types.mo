import InvoiceTypes "../invoice/types";


// TO DO: paste directly the types used from the invoice canister here
// TO DO: check if it makes more sense to have more detailed errors, or one
// type of error per function
module {
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
    };
    
    public type User = {
        id: Principal;
        name: Text;
        joined_date: Int;
        avatar: ?Blob;
        invoices: [Text];  // relation to invoice
        questions: [Text]; // relation to user
        answers: [Text];   // relation to answer
    };

    public type Invoice = {
        id: Text;
        buyer_id: Principal; // relation to user
    };

    public type QuestionStatus =  {
        #OPEN;
        #PICKANSWER;
        #DISPUTABLE;
        #DISPUTED;
        #CLOSED;
    };

    // TODO: Changed from Int32 to int check if we have int32 due to graphql
    public type Question = {
        id: Text;
        author_id: Principal; // relation to user
        invoice_id: Text; // relation to invoice
        creation_date: Int;
        status: QuestionStatus;
        status_update_date: Int;
        status_end_date: Int;
        open_duration: Int;
        title: Text;
        content: Text;
        reward: Int;
        winner: ?Text; // relation to user
        close_transaction_block_height: ?Text;
        answers: [Text]; // relation to answer
    };

    public type Answer = {
        id: Text;
        author_id: Principal; // relation to user
        question_id: Text; // relation to question
        creation_date: Int;
        content: Text;
    };


    /* 
    public type AdminType =  {
        id: Text;
        principal: Text;
    }; */

    // ---------------------------------------
    public type InstallMarketArguments = {
        invoice_canister: Principal;
        graphql_canister: Principal;
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
        pick_answer_duration_minutes: ?Int32;
        disputable_duration_minutes: ?Int32;
    };

    public type Error = {
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
    };
}