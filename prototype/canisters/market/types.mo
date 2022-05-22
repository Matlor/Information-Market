import Invoice "ic:r7inp-6aaaa-aaaaa-aaabq-cai";

module {

    // Invoice
    public type OpenQuestionError = {
        #IncorrectDeadline;
        #InvoiceError: Invoice.VerifyInvoiceErr;
    };

    public type AnswerError = {
        #QuestionNotFound;
        #WrongTimeInterval;
        #YouAreOwner;
    };

    // pickWinner
    public type PickWinnerError = {
        #QuestionNotFound;
        #YouAreNotOwner;
        #WrongTimeInterval;
        #AnswerDoesNotExist;
    };

    // dispute
    public type TriggerDisputeError = {
        #QuestionNotFound;
        #WrongTimeInterval;
        #DisputeAlreadyTriggered;
        #CallerDidNotAnswer;
    };

    // arbitration
    public type ArbitrationError = {
        #QuestionNotFound;
        #WrongTimeInterval;
        #DisputeNotTriggered;
        #CallerIsNotArbitor;
        #AnswerNotFound;
    };

    // payout
    public type PayoutError = {
        #QuestionNotFound;
        #TransferFailed: Invoice.TransferError;
        #QuestionIsClosed;
        #WrongTimeInterval;
    };
}