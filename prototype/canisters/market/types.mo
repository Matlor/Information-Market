import InvoiceTypes "../invoice/types";

// TO DO: check if it makes more sense to have more detailed errors, or one
// type of error per function
module {

  public type InstallMarketParams = {
    invoice_canister: Principal;
    coin_symbol: Text;
    min_reward_e8s: Nat;
    transfer_fee_e8s: Nat;
    pick_answer_duration_minutes: Int32;
    disputable_duration_minutes: Int32;
    update_status_on_heartbeat: Bool;
  };

  public type UpdateMarketParams = {
    min_reward_e8s: ?Nat;
    transfer_fee_e8s: ?Nat;
    pick_answer_duration_minutes: ?Int32;
    disputable_duration_minutes: ?Int32;
    update_status_on_heartbeat: ?Bool;
  };

  public type Error = {
      #NotFound;
      #NotAllowed;
      #WrongStatus;
      #GraphQLError;
      #VerifyInvoiceError: InvoiceTypes.VerifyInvoiceErr;
      #AccountIdentifierError;
      #TransferError: InvoiceTypes.TransferError;
      #UserNotFound;
      #UserExists;
  };
}