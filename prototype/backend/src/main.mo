import Nat "mo:base/Nat";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Debug "mo:base/Debug";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Buffer "mo:base/Buffer";

import invoiceCanister "ic:r7inp-6aaaa-aaaaa-aaabq-cai";


shared({ caller = initializer }) actor class Prototype() = this {

    // ------------------------- Types -------------------------
    
    // Question

    // only closed status might be necessary
    public type QuestionStatus = {
        #Created;
        #Open;
        #PickAnswer;
        #Disputable;
        #Disputed;
        #Closed;
    };
    
    public type Deadlines = {
        answers: Time.Time;
        pickWinner: Time.Time;
        dispute: Time.Time;
        arbitration: Time.Time;
    };

    public type Question = {
        id: Nat;
        timestamp: Time.Time;
        deadlines: Deadlines;
        content: Text;
        owner: Principal;
        reward: Nat;
        invoiceId: Nat;
        status: QuestionStatus;
        answerIds: [Nat];
        winner: ?Nat;
        dispute: ?Principal;
        arbitrationWinner: ?Nat;
        blockId: ?Nat64;
    };
    
    // Invoice
    public type OpenQuestionError = {
        #IncorrectDeadline;
        #InvoiceError: invoiceCanister.VerifyInvoiceErr;
        #InvoiceAlreadyVerified : {
            invoice:invoiceCanister.Invoice;
            question: Question;
        };
    };

    public type OpenQuestionSuccess = {
        invoice: invoiceCanister.Invoice;
        question: Question;
    };

    // deadline restrictions
    public type DeadlineBoundariesMinutes = {
        min: DeadlineRestrictionValues;
        max: DeadlineRestrictionValues;
    };

    public type DeadlineRestrictionValues = {
        answers: Nat;
        pickWinner: Nat; 
        dispute: Nat;
        arbitration: Nat;
    };

    // Answer
    public type Answer = {
        questionId: Nat;
        id: Nat;
        owner: Principal;
        content: Text;
        timestamp: Time.Time;
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
        #TransferFailed: invoiceCanister.TransferError;
        #QuestionIsClosed;
        #WrongTimeInterval;
    };

    // ------------------------- Data -------------------------
    var questionsCounter: Nat = 0;
    var questions: HashMap.HashMap<Nat, Question> = HashMap.HashMap(10, Nat.equal, Hash.hash);

    // We have to map invoice Ids to question Ids, to find question in the #AlreadyPaid case of the invoice.
    var invoiceIds: HashMap.HashMap<Nat, Nat> = HashMap.HashMap(10, Nat.equal, Hash.hash);

    var answersCounter: Nat = 0;
    var answers: HashMap.HashMap<Nat, Answer> = HashMap.HashMap(10, Nat.equal, Hash.hash);


    // ------------------------- Dummy -------------------------

    public shared({caller}) func create_dummyData(): async Bool {

        let deadlines: ?Deadlines = set_deadlines(31);

        switch(deadlines){
            case(null){
                return false
            };
            case(? deadlines){
                // loop
                for(i in Iter.range(0, 10)){
                    let question: Question = {
                        id = questionsCounter;
                        timestamp= Time.now();
                        deadlines= deadlines;
                        content= "test question";
                        owner= caller;
                        reward= 1250001;
                        invoiceId= 0;
                        status= #Open;
                        answerIds= [0, 1, 2, 3];
                        winner= ?1;
                        dispute= null;
                        arbitrationWinner= null;
                        blockId= ?4;
                    };

                    questions.put(questionsCounter, question);
                    questionsCounter+=1;
                };

                return true;
            };
        };

      
    };

    // ------------------------- Getter -------------------------
    public func get_questionsCounter(): async Nat {
        return questionsCounter;
    };

    // answers not included only ids
    public func get_question (questionId: Nat) : async ?Question {
        questions.get(questionId);
    }; 

    public func get_questions() : async ?[Question] {
        if(questionsCounter < 1){
            return null;
        };
        let entries = Iter.toArray(questions.vals());

        return ?entries;
    };

    public shared func get_invoice (invoiceId: Nat) : async invoiceCanister.GetInvoiceResult {
        await invoiceCanister.get_invoice({
            id=invoiceId; 
        });
    }; 

    // Return type should rather be err/success
    public shared func get_answers(questionId: Nat): async ?[Answer] {
        let question: ?Question = questions.get(questionId);

        switch(question){
            case(null){
                return null;
            };
            // if found
            case(? question){

                let ids: [Nat] = question.answerIds;
                let iter: Iter.Iter<Nat> = Iter.fromArray(ids);
                let answerBuffer: Buffer.Buffer<Answer> = Buffer.Buffer<Answer>(Iter.size(iter));

                for(x in iter){
                    let answer:?Answer = answers.get(x);
                    switch(answer){
                        case(null){};
                        case(? answer){answerBuffer.add(answer);};
                    };
                };
                return ?answerBuffer.toArray();
            };
        };
    };
   
    // ------------------------- Question -------------------------

    let deadlineRestictions : DeadlineBoundariesMinutes = {
        min = {
            answers = 30;
            pickWinner = 60;
            dispute = 60;
            arbitration = 2880;
        };
        max = {
            answers = 10080;
            pickWinner = 1440;
            dispute = 1440;
            arbitration = 4320;
        };
    };

    let minReward: Nat = 1250000;

    // the reward values have to be in a certain range depending on fees. 0.0125 ICP min I would propose. 1250000 e8s.
    // should check for error messages of the create_invoice function.
    public shared ({caller}) func obtain_invoice (reward: Nat) : async Result.Result<invoiceCanister.CreateInvoiceResult, Text>  {
        if(reward > 1250000) {
            return #ok (await invoiceCanister.create_invoice({amount=reward; details=null; permissions=null; token={symbol="ICP"}}));
        } else {
            return #err "Reward is below minium";
        };
    }; 

    public shared ({caller}) func open_question (invoiceId: Nat, content: Text, duration: Nat) : async Result.Result<OpenQuestionSuccess, OpenQuestionError> {
        let deadlines: ?Deadlines = set_deadlines(duration);
        switch(deadlines){
            case(null){
                return #err( #IncorrectDeadline);
            };
            case(? deadlines){
                let verifyResult = await invoiceCanister.verify_invoice({id = invoiceId});
                switch(verifyResult){
         
                    case(#err err) {  
                        return #err( #InvoiceError ({message = err.message; kind = err.kind}));              
                    };

                    case(#ok success){
                        switch(success){
                            // creates question
                            case(#Paid {invoice}){
                                let newQuestion: Question = {
                                    id = questionsCounter;
                                    timestamp = Time.now();
                                    deadlines = {
                                        answers = deadlines.answers;
                                        pickWinner = deadlines.pickWinner;
                                        dispute = deadlines.dispute;
                                        arbitration = deadlines.arbitration;
                                    };
                                    content = content;
                                    owner = caller;
                                    reward = invoice.amount;
                                    invoiceId = invoice.id;
                                    status = #Open;
                                    answerIds = [];
                                    winner = null;
                                    dispute = null;
                                    arbitrationWinner = null;
                                    blockId = null;
                                };
                                questionsCounter+=1;
                                // links invoice id to question id
                                invoiceIds.put(invoice.id, newQuestion.id);
                                questions.put(newQuestion.id, newQuestion);

                                return #ok( {invoice = invoice; question = newQuestion});              
                            };
                        
                            // Maybe returning queston makes it too complicated
                            case(#AlreadyVerified invoice){
                                // should never return null
                                let existingQuestion: ?Question = do ?{
                                    let questionId: ?Nat = invoiceIds.get(invoiceId);
                                    let question: ?Question = questions.get(questionId!);
                                    question!;
                                };
                                switch(existingQuestion){
                                    case(null){
                                        Debug.trap("no question found, trapped");
                                    };
                                    case(? existingQuestion){
                                        return #err( #InvoiceAlreadyVerified ({invoice = invoice.invoice; question = existingQuestion}));   
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
    };
    
    // Computes all the deadlines based on global restrictions
    func set_deadlines(proposedDuration: Nat): ?Deadlines {
        if(proposedDuration < deadlineRestictions.min.answers) {
            return null;
        } else if (proposedDuration > deadlineRestictions.max.answers) {
            return null;
        } else {
            let minutesToNano: Nat = 60000000000;

            func calculateDeadline (durationMinutes:Nat, min: Nat, max:Nat): Time.Time{
                if(durationMinutes < min){
                    return min * minutesToNano
                } else if (durationMinutes > max) {
                    return max * minutesToNano
                } else {
                    return durationMinutes * minutesToNano
                };
            };

            let answersDeadline: Time.Time = proposedDuration * minutesToNano + (Time.now());
            let pickWinnerDeadline: Time.Time = calculateDeadline(proposedDuration, deadlineRestictions.min.pickWinner, deadlineRestictions.max.pickWinner) + answersDeadline;
            let disputeDeadline: Time.Time = calculateDeadline(proposedDuration, deadlineRestictions.min.dispute, deadlineRestictions.max.dispute) + pickWinnerDeadline;
            let arbitrationDeadline: Time.Time = calculateDeadline(proposedDuration, deadlineRestictions.min.arbitration, deadlineRestictions.max.arbitration) + disputeDeadline;

            let deadlines: Deadlines= {
                answers = answersDeadline;
                pickWinner = pickWinnerDeadline;
                dispute = disputeDeadline;
                arbitration = arbitrationDeadline;
            };
            return ?deadlines;    
        };
    };

    // ------------------------- Answers -------------------------

    public shared ({caller}) func answer(questionId: Nat, content: Text): async Result.Result<Question, AnswerError> {
        let question: ?Question = questions.get(questionId);    
        switch(question){
            case(null){
                return (#err(#QuestionNotFound));
            };
            case(? question){
                if(question.owner == caller){
                    return (#err(#YouAreOwner));    
                } else if (question.deadlines.answers > Time.now()){
                    let answer: Answer = {
                        questionId = questionId;
                        id = answersCounter;
                        owner =  caller;
                        content = content;
                        timestamp = Time.now();
                    };
          
                    answers.put(answersCounter, answer);
                    
                    // link answer to question by replacing it
                    let modifiedQuestion: Question = addAnswer(question, answersCounter);
                    questions.put(question.id, modifiedQuestion);

                    answersCounter+=1;
                    
                    return #ok modifiedQuestion;
                } else {
                    return (#err (#WrongTimeInterval));
                };
            };
        };
    };

    func addAnswer(question: Question, answerId:Nat): Question {
        // create buffer from array to add to it. 
        let iter: Iter.Iter<Nat> = Iter.fromArray(question.answerIds);
        let buf: Buffer.Buffer<Nat> = Buffer.Buffer<Nat>(Iter.size(iter));

        var i:Nat = 0;
        for(x in Iter.range(0, question.answerIds.size())){
            if(i <  question.answerIds.size()){
                buf.add(question.answerIds[i]);
            };
            i +=1;
        }; 
        
        buf.add(answerId);

        // buffer to array
        let newQuestion: Question = {
            id = question.id;
            timestamp = question.timestamp;
            deadlines = question.deadlines;
            content = question.content;
            owner = question.owner;
            reward = question.reward;
            invoiceId = question.invoiceId;
            status = question.status;
            answerIds = buf.toArray();
            winner = question.winner;
            dispute = question.dispute;
            arbitrationWinner= question.arbitrationWinner;
            blockId = question.blockId;

        };
    };

    // ------------------------- Pick Winner -------------------------
    public shared ({caller}) func pick_winner(questionId: Nat, answerId: Nat): async Result.Result<Question, PickWinnerError> {

        let question: ?Question = questions.get(questionId);

        switch(question){
            case(null){
                return #err( #QuestionNotFound);
            };
            case(? question){
                if(caller != question.owner){
                    return #err( #YouAreNotOwner);
                };
                // untested!
                if (question.deadlines.pickWinner <= Time.now()){
                     return #err( #WrongTimeInterval);
                }; 
                
                // check if answerId is among answer ids on the question.
                // goes through array and returns value if compare function is true. 
                func compare(id:Nat): Bool {
                    if(answerId == id ){
                        return true;
                    } else {
                        return false;
                    };
                };
                let found: ?Nat = Array.find(question.answerIds, compare);
                switch(found){
                    case(null){
                        return #err( #AnswerDoesNotExist);
                    };
                    // Pick the actual winner
                    case(? value){
                        let newQuestion: Question = {
                            id = question.id;
                            timestamp = question.timestamp;
                            deadlines = question.deadlines;
                            content = question.content;
                            owner = question.owner;
                            reward = question.reward;
                            invoiceId = question.invoiceId;
                            status = question.status;
                            answerIds = question.answerIds;
                            winner = ?answerId;
                            dispute = question.dispute;
                            arbitrationWinner= question.arbitrationWinner;
                            blockId = question.blockId;

                        };
                        questions.put(questionId, newQuestion);
                        return #ok(newQuestion);
                    };
                };
            };
        };
    };

    // ------------------------- Dispute -------------------------

    // TO DO: Nothing prevents spam at the moment. In case function would cost, it should be free to call if owner did not pick a winner.
    public shared ({caller}) func trigger_dispute(questionId: Nat): async Result.Result<Question, TriggerDisputeError> {

        let question: ?Question = questions.get(questionId);

        switch(question){
            case(null){
                return #err( #QuestionNotFound);
            };
            case(? question){
                // untested!
                if (Time.now() >= question.deadlines.dispute or question.deadlines.pickWinner > Time.now()){
                    return #err( #WrongTimeInterval);
                };  
                if(question.dispute != null){
                    return #err(#DisputeAlreadyTriggered);
                };

                // following mapping would be useful here: question -> answerer principal -> answer 
                // iterate through answersId to check if caller has given answer
                func compare(id:Nat): Bool {
                    let answer: ?Answer = answers.get(id);
                    switch(answer){
                        case(null){
                            return false;
                        };
                        case(? answer){
                            if(answer.owner == caller){
                                return true;
                            } else {
                                return false;
                            };
                        };
                    };
                };
                // found is the answerId of the answer for which the caller is the owner
                let found: ?Nat = Array.find(question.answerIds, compare);
                switch(found){
                    case(null){
                        return #err(#CallerDidNotAnswer);
                    };
                    // trigger the dispute 
                    case(? value){
                        let newQuestion: Question = {
                            id = question.id;
                            timestamp = question.timestamp;
                            deadlines = question.deadlines;
                            content = question.content;
                            owner = question.owner;
                            reward = question.reward;
                            invoiceId = question.invoiceId;
                            status = question.status;
                            answerIds = question.answerIds;
                            winner = question.winner;
                            dispute = ?caller;
                            arbitrationWinner= question.arbitrationWinner;
                            blockId = question.blockId;

                        };
                        questions.put(questionId, newQuestion);

                        return #ok(newQuestion);
                    };
                };
            };
        }
    };

    // ------------------------- Arbitration -------------------------

    // centralised version: contract deployer is arbitor
    // TO DO: case is not handled where no arbitration occurs.
    public shared ({caller}) func arbitrate(questionId: Nat, answerId:Nat): async Result.Result<Question, ArbitrationError> {
        let question: ?Question = questions.get(questionId);

        switch(question){
            case(null){
                return #err( #QuestionNotFound);
            };
            case(? question){
                // untested!
                if (Time.now() >= question.deadlines.arbitration or Time.now() < question.deadlines.dispute){
                    return #err( #WrongTimeInterval);
                };  
                
                if (question.dispute == null){
                    return #err(#DisputeNotTriggered);
                } else if(caller != initializer){
                    return #err(#CallerIsNotArbitor);
                } else {
                    // pick winner
                    let answer: ?Answer = answers.get(answerId);
                    switch(answer){
                        case(null){
                            return #err(#AnswerNotFound);
                        };
                        case(? answer){
                            let newQuestion: Question = {
                                id = question.id;
                                timestamp = question.timestamp;
                                deadlines = question.deadlines;
                                content = question.content;
                                owner = question.owner;
                                reward = question.reward;
                                invoiceId = question.invoiceId;
                                status = question.status;
                                answerIds = question.answerIds;
                                winner = question.winner;
                                dispute = question.dispute;
                                arbitrationWinner = ?answerId;
                                blockId = question.blockId;

                            };
                            questions.put(questionId, newQuestion);
                            return #ok(newQuestion);  
                        };
                    }; 
                };
            };  
        };      
    };

    // ------------------------- Payout -------------------------


    // everyone can call this function.
    // TO DO: payout does not consider that triggering a dispute should cost a fee.
    // TO DO: payout does not consider that a questioner needs incentives to pick a winner.
    // TO DO: the case is not handled that the arbitor never does it's job.
    public func payout(questionId: Nat): async Result.Result<Question, PayoutError> {
        let question: ?Question = questions.get(questionId);
        switch(question){
            case(null){
                return #err( #QuestionNotFound);
            };
            case(? question){

                if(question.status == #Closed){
                    return #err(#QuestionIsClosed);
                };
                // simplification: we are always waiting for arbitration phase to pass by.
                // untested!
                if(Time.now() < question.deadlines.arbitration){
                    return #err(#WrongTimeInterval);
                };  
                
                let finalWinner: ?Principal = do ?{
                    let finalWinnerId: ?Nat = 
                    if(question.arbitrationWinner != null){
                        question.arbitrationWinner;
                        // it might be unnecessary to check for question.pick_winner != null
                    } else if(question.dispute == null and question.winner != null){
                        question.winner;
                    } else {
                        null;
                    };
                    let answer: ?Answer = answers.get(finalWinnerId!);
                    answer!.owner;
                };
                // if no winner and no arbitrationWinner can be found or if the principal can't be found we should trap.
                switch(finalWinner){
                    case(null){
                        Debug.trap("trapped: no winner could be determined");
                    };
                    case(? finalWinner){
                        let result: invoiceCanister.TransferResult = await invoiceCanister.transfer({
                            amount = question.reward;
                            token = {symbol = "ICP"};
                            destination = #principal(finalWinner);
                        });

                        switch(result){
                            case(#err err){
                                return #err(#TransferFailed(err));
                            };
                            case(#ok result){
                                // replace status and blockId
                                let newQuestion: Question = {
                                    id = question.id;
                                    timestamp = question.timestamp;
                                    deadlines = question.deadlines;
                                    content = question.content;
                                    owner = question.owner;
                                    reward = question.reward;
                                    invoiceId = question.invoiceId;
                                    status = #Closed;
                                    answerIds = question.answerIds;
                                    winner = question.winner;
                                    dispute = question.dispute;
                                    arbitrationWinner = question.arbitrationWinner;
                                    blockId = ?result.blockHeight;
                                };
                                questions.put(questionId, newQuestion);
                                return #ok(newQuestion); 
                            };
                        };
                    };
                };
            };
        };    
    };
};