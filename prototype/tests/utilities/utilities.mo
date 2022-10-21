import Accounts            "../../canisters/market/ledger/accounts";
import Hex                 "../../canisters/market/ledger/Hex";

import Array               "mo:base/Array";
import Blob                "mo:base/Blob";
import Debug               "mo:base/Debug";
import Iter                "mo:base/Iter";
import Int                 "mo:base/Int";
import Nat8                "mo:base/Nat8";
import Nat32               "mo:base/Nat32";
import Principal           "mo:base/Principal";

shared actor class Utilities() {

  public query func getDefaultAccountIdentifierAsBlob(
    principal: Principal,
  ) : async Accounts.AccountIdentifier {
    let identifier = Accounts.accountIdentifier(principal, Accounts.defaultSubaccount());
    if(Accounts.validateAccountIdentifier(identifier)){
      return identifier;
    } else {
      Debug.trap("Could not get account identifier");
    };
  };

  public query func getAccountIdentifierAsBlob(
    main_principal: Principal,
    sub_principal: Principal,
  ) : async Accounts.AccountIdentifier {
    let identifier = Accounts.accountIdentifier(main_principal, Accounts.principalToSubaccount(sub_principal));
    if(Accounts.validateAccountIdentifier(identifier)){
      return identifier;
    } else {
      Debug.trap("Could not get account identifier");
    };
  };

  public query func getDefaultAccountIdentifierAsText(
    principal: Principal,
  ) : async Text {
    let identifier = Accounts.accountIdentifier(principal, Accounts.defaultSubaccount());
    if(Accounts.validateAccountIdentifier(identifier)){
      return Hex.encode(Blob.toArray(identifier));
    } else {
      Debug.trap("Could not get account identifier");
    };
  };

  public query func getAccountIdentifierAsText(
    main_principal: Principal,
    sub_principal: Principal,
  ) : async Text {
    let identifier = Accounts.accountIdentifier(main_principal, Accounts.principalToSubaccount(sub_principal));
    if(Accounts.validateAccountIdentifier(identifier)){
      return Hex.encode(Blob.toArray(identifier));
    } else {
      Debug.trap("Could not get account identifier");
    };
  };

  public query func convertAccountToBlob(account: Text) : async Blob {
    return Blob.fromArray(Hex.decode(account));
  };

  public query func getPrincipalAsText(principal: Principal) : async Text {
    return Principal.toText(principal);
  };

  public query func principalToSubaccount(principal: Principal) : async Blob {
    return Accounts.principalToSubaccount(principal);
  };
};