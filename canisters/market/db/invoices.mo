import Types        "../types";
import Trie         "mo:base/Trie";
import Text         "mo:base/Text";
import Nat          "mo:base/Nat";
import Principal    "mo:base/Principal";
import Blob         "mo:base/Blob";
import Result       "mo:base/Result";

module {

    type Invoice = Types.Invoice;

    public class Invoices() {

        var invoices: Trie.Trie<Text, Invoice> = Trie.empty<Text, Invoice>();
        // --------------------- HELPER ---------------------
        
        public func validate_key(key:Text) : Bool {
            if(get_invoice(key) == null){return false}
            else {return true};
        };

        // --------------------- CRUD ---------------------
        // get
        // create
        // update
        // delete: not needed

        public func get_invoice(id:Text) : ?Invoice{
            Trie.get(invoices, {key=id; hash=Text.hash(id)}, Text.equal);
        };

        public func create_invoice(newInvoice:Invoice) : Invoice {
            let (newTrie, prevValue) : (Trie.Trie<Text, Invoice>, ?Invoice) = Trie.put(invoices, {key=newInvoice.id; hash=Text.hash(newInvoice.id)}, Text.equal, newInvoice);
            invoices:= newTrie;
            return newInvoice;
        };

        public func update_invoice(invoice:Invoice) : Result.Result<Invoice, Types.StateError> {
           switch(get_invoice(invoice.id)) {
                case (null) { 
                    return #err(#InvoiceNotFound) 
                };
                case (?val) { 
                    let (newTrie, prevValue) : (Trie.Trie<Text, Invoice>, ?Invoice) = Trie.put(invoices, {key=invoice.id; hash=Text.hash(invoice.id)}, Text.equal, invoice);
                    invoices:= newTrie;
                    return #ok(invoice);
                };
            };
        };

        // --------------------- UPGRADE ---------------------
         public func share() : Trie.Trie<Text, Invoice> {
            invoices;
        };
    };
};

