import Debug        "mo:base/Debug";
import Int32        "mo:base/Int32";
import Int          "mo:base/Int";
import Principal    "mo:base/Principal";
import Time         "mo:base/Time";

import Accounts     "ledger/accounts";

module {

    // TODO: Changed from Int32 to Int check of ok
    public func time_minutes_now() : Int {
        Time.now() / 60000000000
    };

    public func nat_to_int32(amount:Nat) : Int32 {
        if (amount > 214748364700000) {
            Debug.trap("Cannot convert Nat amount to Int32 value exceeds max integer size!");
        };
        return Int32.fromInt(amount);
    };

    public func round_up_to_e3s(amount: Nat): Nat{
        if(amount % 100000 == 0){
            return amount;
        } else {
            return (amount/100000 + 1)*100000;
        }
    };

    public func e8s_to_e3s(amount: Nat) : Int32 {
        let amount_e3s = amount / 100000;
        // max integer is 2147483647
        if (amount_e3s > 2147483647) {
            Debug.trap("Cannot convert e8s(Nat) amount to e3s(Int32): value exceeds max integer size!");
        };
        return Int32.fromInt(amount_e3s);
    };

    public func e3s_to_e8s(amount: Int32) : Nat {
        return Int.abs(Int32.toInt(amount)) * 100000;
    };

    public func getDefaultAccountIdentifier(
        principal: Principal,
    ) : ?Accounts.AccountIdentifier {
        let identifier = Accounts.accountIdentifier(principal, Accounts.defaultSubaccount());
        if(Accounts.validateAccountIdentifier(identifier)){
            return ?identifier;
        } else {
            return null;
        };
    };
}