import Invoice "ic:r7inp-6aaaa-aaaaa-aaabq-cai";

// TO DO: paste directly the types used from the invoice canister here
// TO DO: check if it makes more sense to have more detailed errors, or one
// type of error per function
module {

    public type Error = {
        #NotFound;
        #NotAllowed;
        #WrongStatus;
        #GraphQLError;
        #VerifyInvoiceError: Invoice.VerifyInvoiceErr;
        #TransferError: Invoice.TransferError;
    };
}