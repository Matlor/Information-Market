import Nat        "mo:base/Nat";
import Nat64     "mo:base/Nat64";
import Nat32     "mo:base/Nat32";
import Nat8      "mo:base/Nat8";
import Principal  "mo:base/Principal";
import Text       "mo:base/Text";
import Bool      "mo:base/Bool";
import Blob      "mo:base/Blob";
import Array     "mo:base/Array";
import Buffer    "mo:base/Buffer";
import Debug        "mo:base/Debug";

import Hex          "Hex";
import CRC32        "CRC32";
import SHA224       "SHA224";




module {

  

    // ------------ Helper functions -----------------
    public func accountToBlob(textAccount: Text): ?Blob {
        switch(Hex.decode(textAccount)){
            case(#ok res){ ?Blob.fromArray(res)};
            case(#err res){return null};
        };
    };

    public func blobToAccount(blobAccount: Blob): Text {
        return  Hex.encode(Blob.toArray(blobAccount))
    };

 


    // ----------- Create Account Ids -----------------
    func beBytes(n : Nat32) : [Nat8] {
        func byte(n : Nat32) : Nat8 {
        Nat8.fromNat(Nat32.toNat(n & 0xff))
        };
        [byte(n >> 24), byte(n >> 16), byte(n >> 8), byte(n)]
    };


    func validateAccountIdentifier(accountIdentifier : Blob) : Bool {
        if (accountIdentifier.size() != 32) {
        return false;
        };
        let a = Blob.toArray(accountIdentifier);
        let accIdPart    = Array.tabulate(28, func(i : Nat) : Nat8 { a[i + 4] });
        let checksumPart = Array.tabulate(4,  func(i : Nat) : Nat8 { a[i] });
        let crc32 = CRC32.ofArray(accIdPart);
        Array.equal(beBytes(crc32), checksumPart, Nat8.equal)
    };

    func accountIdentifier(principal : Principal, subaccount : Blob) : Blob {
        let hash = SHA224.Digest();
        hash.write([0x0A]);
        hash.write(Blob.toArray(Text.encodeUtf8("account-id")));
        hash.write(Blob.toArray(Principal.toBlob(principal)));
        hash.write(Blob.toArray(subaccount));
        let hashSum = hash.sum();
        let crc32Bytes = beBytes(CRC32.ofArray(hashSum));
        let buf = Buffer.Buffer<Nat8>(32);
        Blob.fromArray(Array.append(crc32Bytes, hashSum))
    };
  
    // Based on Godwin code
    func nat64ToBytes(x : Nat64) : [Nat8] {
        [ 
        Nat8.fromNat(Nat64.toNat((x >> 56) & (255))),
        Nat8.fromNat(Nat64.toNat((x >> 48) & (255))),
        Nat8.fromNat(Nat64.toNat((x >> 40) & (255))),
        Nat8.fromNat(Nat64.toNat((x >> 32) & (255))),
        Nat8.fromNat(Nat64.toNat((x >> 24) & (255))),
        Nat8.fromNat(Nat64.toNat((x >> 16) & (255))),
        Nat8.fromNat(Nat64.toNat((x >> 8) & (255))),
        Nat8.fromNat(Nat64.toNat((x & 255))) 
        ];
    };

  
    // Based on Godwin code
    public func getSubaccount( id: Nat64) : Blob {
        let buffer = Buffer.Buffer<Nat8>(32);
        buffer.append(Buffer.fromArray(nat64ToBytes(id)));
        buffer.append(Buffer.fromArray(Array.tabulate<Nat8>(24, func i = 0)));
        assert(buffer.size() == 32);
        Blob.fromArray(Buffer.toArray(buffer));
    };

    public func getAccountId (id: Nat64, principalText:Text) : Blob {
        let subaccount = getSubaccount(id);
        let principal = Principal.fromText(principalText);
        let accountId = accountIdentifier(principal, subaccount);
        //Debug.print(debug_show(accountId));
        //Debug.print(debug_show(validateAccountIdentifier(accountId)));
        //Debug.print(debug_show(Hex.encode(Blob.toArray(accountId))));
        return accountId;
    };

    public func getDefaultAccountId(principal: Principal) : Blob {
        getAccountId(Nat64.fromNat(0), Principal.toText(principal));
    };

    //A.getAccountId(Nat64.fromNat(0), Principal.toText(Principal.fromActor(this)));


    /* public func generateInvoiceSubaccount (args : GenerateInvoiceSubaccountArgs) : Blob {
        let idHash = SHA224.Digest();
        // Length of domain separator
        idHash.write([0x0A]);
        // Domain separator
        idHash.write(Blob.toArray(Text.encodeUtf8("invoice-id")));
        // Counter as Nonce
        let idBytes = A.beBytes(Nat32.fromNat(args.id));
        idHash.write(idBytes);
        // Principal of caller
        idHash.write(Blob.toArray(Principal.toBlob(args.caller)));

        let hashSum = idHash.sum();
        let crc32Bytes = A.beBytes(CRC32.ofArray(hashSum));
        let buf = Buffer.Buffer<Nat8>(32);
        Blob.fromArray(Array.append(crc32Bytes, hashSum));
    }; */



};