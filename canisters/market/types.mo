import InvoiceTypes "../invoice/types";


// TO DO: paste directly the types used from the invoice canister here
// TO DO: check if it makes more sense to have more detailed errors, or one
// type of error per function
module {
   

    // TODO: Should id be principal instead?
    public type User = {
        id: Text;
        name: Text;
        joined_date: Int32;
    };

    // TODO: should the buyer be linked only with the id?
    // this is one by one I could have a copy
    public type Invoice = {
        id: Text;
        buyer: User;
    };

    public type QuestionStatus =  {
        #OPEN;
        #PICKANSWER;
        #DISPUTABLE;
        #DISPUTED;
        #CLOSED;
    };

    // I link the answers by ids only
    public type Question = {
        id: Text;
        author: User;
        author_invoice: Invoice;
        creation_date: Int32;
        status: QuestionStatus;
        status_update_date: Int32;
        status_end_date: Int32;
        open_duration: Int32;
        title: Text;
        content: Text;
        reward: Int32;
        winner: ?Text;
        close_transaction_block_height: ?Text;
         
        answer: [?Text];
    };

    public type Answer = {
        id: Text;
        author: User;
        creation_date: Int32;
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