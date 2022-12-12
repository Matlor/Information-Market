import Types        "../types";
import Trie         "mo:base/Trie";
import Text         "mo:base/Text";
import Nat          "mo:base/Nat";
import Principal    "mo:base/Principal";
import Blob         "mo:base/Blob";
import Result       "mo:base/Result";
import Buffer         "mo:base/Buffer";
import Hash         "mo:base/Hash";



module {

    // for convenience
    type Invoice = Types.Invoice;

    public class Invoices() {

        var invoices: Trie.Trie<Nat, Invoice> = Trie.empty<Nat, Invoice>();
       
       // --------------------- HELPER ---------------------
        
        public func validate_key(key:Nat) : Bool {
            // if it does not exist yet, it is a valid key
            if(get_invoice(key) == null){ return true } 
            else { return false };
        };
        
        public func replace_question_id(prevInvoice: Invoice, question_id:Text) : Invoice {            
            return {prevInvoice with question_id = ?question_id};
        };

        // --------------------- CRUD ---------------------
        // get
        // create
        // update

        public func get_invoice(id:Nat) : ?Invoice{
            // TODO: field hash is deprecated:
            Trie.get(invoices, {key=id; hash=Hash.hash(id)}, Nat.equal);
        };

        // TO DO: if I had it, I could use the put_invoice function here
        // TO DO: there is a wrong assumption here I will 
        public func create_invoice(invoice_id:Nat, buyer_id:Principal) : Invoice {
            let newInvoice: Invoice = {
                id = invoice_id;
                buyer_id;
                question_id = null;
            };
    
            let (newTrie, prevValue) : (Trie.Trie<Nat, Invoice>, ?Invoice) = Trie.put(invoices, {key=newInvoice.id; hash=Hash.hash(newInvoice.id)}, Nat.equal, newInvoice);
            invoices:= newTrie;
            return newInvoice;
        };

        public func put_invoice(invoice:Invoice) : Invoice {
            let (newTrie, prevValue) : (Trie.Trie<Nat, Invoice>, ?Invoice) = Trie.put(invoices, {key=invoice.id; hash=Hash.hash(invoice.id)}, Nat.equal, invoice);
            invoices:= newTrie;
            return invoice;
        };        

        // --------------------- UPGRADE ---------------------
        // TODO: 
        public func share() : Trie.Trie<Nat, Invoice> {
            invoices;
        };
    };
};

