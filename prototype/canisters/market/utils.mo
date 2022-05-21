module {

    public type Deadlines = {
        answers: Time.Time;
        pickWinner: Time.Time;
        dispute: Time.Time;
        arbitration: Time.Time;
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
    }; // @todo: in cstor

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
}