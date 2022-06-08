import Debug "mo:base/Debug";
import Int32 "mo:base/Int32";
import Int "mo:base/Int";
import Time "mo:base/Time";

module {

    public let max_integer = 2147483647;

    public func time_minutes_now() : Int32 {
        Int32.fromInt(Time.now() / 60000000000);
    };

    public func e8s_to_e3s(amount: Nat) : Int32 {
        let amount_e3s = amount / 100000;
        if (amount_e3s > max_integer) {
            Debug.trap("Cannot convert e8s(Nat) amount to e3s(Int32): value exceeds max integer size!");
        };
        return Int32.fromInt(amount_e3s);
    };

    public func e3s_to_e8s(amount: Int32) : Nat {
        return Int.abs(Int32.toInt(amount * 100000));
    };

    // ------------------------- Unused for now -------------------------

    public type Deadlines = {
        answers: Time.Time;
        pickWinner: Time.Time;
        dispute: Time.Time;
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
    };
    
    let deadlineRestictions : DeadlineBoundariesMinutes = {
        min = {
            answers = 30;
            pickWinner = 60;
            dispute = 60;
        };
        max = {
            answers = 10080;
            pickWinner = 1440;
            dispute = 1440;
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

            let deadlines: Deadlines= {
                answers = answersDeadline;
                pickWinner = pickWinnerDeadline;
                dispute = disputeDeadline;
            };
            return ?deadlines;    
        };
    };
}