import InvoiceTypes "../invoice/types";

// TO DO: paste directly the types used from the invoice canister here
// TO DO: check if it makes more sense to have more detailed errors, or one
// type of error per function
module {

    public type InstallMarketArguments = {
        invoice_canister: Principal;
        coin_symbol: Text;
        min_reward_e8s: Nat;
        transfer_fee_e8s: Nat;
        pick_answer_duration_minutes: Nat;
        disputable_duration_minutes: Nat;
        update_status_on_heartbeat: Bool;
    };

    public type Error = {
        #NotFound;
        #NotAllowed;
        #WrongStatus;
        #GraphQLError;
        // TO DO: somehow the VerifyInvoiceErr from the InvoiceTypes is not present 
        // at compilation even if it is defined in invoice_types.mo file
        #VerifyInvoiceError; //: InvoiceTypes.VerifyInvoiceErr;
        #TransferError: InvoiceTypes.TransferError;
        #UserNotFound;
        #UserExists;
    };
}