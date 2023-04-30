import LedgerTypes  "../ledger/ledgerTypes";
import LedgerTypes2 "../ledger/ledgerTypes2"; // needed for block archive
import Buffer       "mo:base/Buffer";
import Iter         "mo:base/Iter";
import A            "../market/invoice/Account";



module {

    // side effect "addresses"
    public func process_blocks(blocks: [LedgerTypes2.Block], addresses: Buffer.Buffer<Blob>) : Nat {
        var transaction_counter: Nat = 0;
        let blocks_iter: Iter.Iter<LedgerTypes2.Block> = Iter.fromArray<LedgerTypes2.Block>(blocks);

        label l for (block in blocks_iter) {
            switch (block.transaction.operation) {
                case (null) { };
                case (?operation) {
                    switch (operation) {
                        case (#Transfer {from; to}) {
                            let (fromIsIncluded, toIsIncluded) = check_addresses_inclusion(operation, addresses);
                            if (fromIsIncluded and toIsIncluded) { 
                                transaction_counter += 1;
                                continue l;
                            } else if (not fromIsIncluded and not toIsIncluded) {
                                continue l;
                            } else if (fromIsIncluded and not toIsIncluded) {
                                transaction_counter += 1;
                                addresses.add(to);
                                continue l;
                            } else if (not fromIsIncluded and toIsIncluded) {
                                addresses.add(from);
                                continue l;
                            };
                        };
                        case (_) { };
                    };
                };
            };
        };
        return transaction_counter;
    };


    // side effect "addresses"
    public func check_addresses_inclusion(operation: LedgerTypes2.Operation, addresses: Buffer.Buffer<Blob>) : (Bool, Bool) {
        var fromIsIncluded: Bool = false;
        var toIsIncluded: Bool = false;
        switch (operation) {
            case (#Transfer {from; to}) {
                for (address in addresses.vals()) {
                    if (address == from) {
                        fromIsIncluded := true;
                    };
                    if (address == to) {
                        toIsIncluded := true;
                    };
                };
            };
            case _ { };
        };
        return (fromIsIncluded, toIsIncluded);
    };

    public func get_account_details(addresses: Buffer.Buffer<Blob>, knownAccounts: [ {name: Text; account: Text} ], ledger_canister: LedgerTypes2.Interface): async [ {name: Text; account: Text; balance: Nat64} ] {
        var accounts: Buffer.Buffer<{name: Text; account: Text; balance: Nat64}> = Buffer.Buffer<{name: Text; account: Text; balance: Nat64}>(10);

        for (address in addresses.vals()) {
            let iter: Iter.Iter<{name: Text; account: Text}> = Iter.fromArray<{name: Text; account: Text}>(knownAccounts);

            var textAddress = {name= ""; account = A.blobToAccount(address); balance = (await ledger_canister.account_balance({ account=address })).e8s };
            label inner for (item in iter) {
                if(textAddress.account == item.account){
                    textAddress :=  {name= item.name; account = textAddress.account; balance= textAddress.balance};
                } else { continue inner };
            };
            accounts.add(textAddress);
        };
        return Buffer.toArray(accounts);
    };
    
};