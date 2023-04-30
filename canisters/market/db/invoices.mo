import Types        "../types";
import Trie         "mo:base/Trie";
import Text         "mo:base/Text";
import Principal    "mo:base/Principal";
import Blob         "mo:base/Blob";
import Result       "mo:base/Result";
import Buffer         "mo:base/Buffer";
import Hash         "mo:base/Hash";
import Iter         "mo:base/Iter";
import Time         "mo:base/Time";

import Nat8      "mo:base/Nat8";
import Nat32     "mo:base/Nat32";
import Nat64     "mo:base/Nat64";
import Nat          "mo:base/Nat";

import  A         "../invoice/Account";



module {

    // for convenience
    type Invoice = Types.Invoice;


    public func init_invoices(initial_invoices:?[Invoice]) : Invoices {
        let invoices: Invoices = Invoices();
        switch(initial_invoices){
            case(null){};
            case(?initial_invoices){
               let initial_invoice_iter: Iter.Iter<Invoice> = Iter.fromArray<Invoice>(initial_invoices);
                for (initial_invoice in initial_invoice_iter) {
                    ignore invoices.put_invoice(initial_invoice);
                };
            };
        };
        return invoices;
    };

    public class Invoices() {

        // --------------------- Storage ---------------------
        var invoices: Trie.Trie<Nat, Invoice> = Trie.empty<Nat, Invoice>();

        public func set_state(initial:[Invoice]) : (){
            var newData: Trie.Trie<Nat, Invoice> = Trie.empty<Nat, Invoice>();
            let initial_iter: Iter.Iter<Invoice> = Iter.fromArray<Invoice>(initial);
            for (question in initial_iter) {
                let (newTrie, prevValue) : (Trie.Trie<Nat, Invoice>, ?Invoice) = Trie.put(newData, {key=question.id; hash=Hash.hash(question.id)}, Nat.equal, question);
                newData:= newTrie;
            };
            invoices:= newData;
        };
       
        // deals with inserting it into the data structure
        public func put_invoice(invoice:Invoice) : Invoice {
            let (newTrie, prevValue) : (Trie.Trie<Nat, Invoice>, ?Invoice) = Trie.put(invoices, {key=invoice.id; hash=Hash.hash(invoice.id)}, Nat.equal, invoice);
            invoices:= newTrie;
            return invoice;
        };  



        var counter: Nat = 1;
        public func generate_id() : Nat {
            let preCounter = counter;
            counter := counter + 1;
            return preCounter;
        }; 


        // --------------------- HELPER ---------------------
        
        // TODO: maybe delete
        public func validate_key(key:Nat) : Bool {
            // if it does not exist yet, it is a valid key
            if(get_invoice(key) == null){ return true } 
            else { return false };
        };
        
        

        // --------------------- CRUD ---------------------
        // create, update

         public func create_invoice(amount: Nat, marketPrincipal: Principal, buyer_id:Principal): Invoice {
            let id = generate_id();

            let invoice : Invoice = {
                id;
                buyer_id; 
                question_id = null;
                amount;
                verifiedAtTime = null;
                paid = false;
                destination = A.getAccountId(Nat64.fromNat(id), Principal.toText(marketPrincipal));
                subAccount = A.getSubaccount(Nat64.fromNat(id));
            };

            return put_invoice(invoice);
        };

        public func verify_invoice(preInvoice: Invoice) : Invoice {
            let newInvoice:Invoice = { 
                preInvoice with 
                    verifiedAtTime = ?Time.now(); 
                    paid = true;  
            };
            return put_invoice(newInvoice);
        };

         public func un_verify_invoice(preInvoice: Invoice) : Invoice {
            let newInvoice:Invoice = { 
                preInvoice with 
                    verifiedAtTime = null; 
                    paid = false;  
            };
            return put_invoice(newInvoice);
        };


        public func replace_question_id(prevInvoice: Invoice, question_id:Text) : Invoice {            
            return { prevInvoice with question_id = ?question_id };
        };


        // public question_to_invoice




        // TO DO: if I had it, I could use the put_invoice function here
        // TO DO: there is a wrong assumption here I will 
        /* public func create_invoice(invoice_id:Nat, buyer_id:Principal) : Invoice {
            let newInvoice: Invoice = {
                id = invoice_id;
                buyer_id;
                question_id = null;
            };
    
            // TODO: replace this with put func
            let (newTrie, prevValue) : (Trie.Trie<Nat, Invoice>, ?Invoice) = Trie.put(invoices, {key=newInvoice.id; hash=Hash.hash(newInvoice.id)}, Nat.equal, newInvoice);
            invoices:= newTrie;
            return newInvoice;
        }; */










            
        // --------------------- QUERIES ---------------------
        public func get_invoice(id:Nat) : ?Invoice{
            // TODO: field hash is deprecated:
            Trie.get(invoices, {key=id; hash=Hash.hash(id)}, Nat.equal);
        };
        
        public func get_invoices() : [Invoice] {
            Trie.toArray<Nat, Invoice, Invoice>(invoices, func(pair:(Nat, Invoice)):Invoice { return pair.1 });
        };

        // --------------------- UPGRADE ---------------------
        // TODO: 
        public func share() : Trie.Trie<Nat, Invoice> {
            invoices;
        };
    };
};

