import Debug "mo:base/Debug";
import Int32 "mo:base/Int32";
import Int "mo:base/Int";
import Time "mo:base/Time";

module {

    public func time_minutes_now() : Int32 {
        Int32.fromInt(Time.now() / 60000000000);
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
        return Int.abs(Int32.toInt(amount * 100000));
    };
}