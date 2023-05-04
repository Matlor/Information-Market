import Types        "../types";
import Text         "mo:base/Text";
import Principal    "mo:base/Principal";
import Blob         "mo:base/Blob";
import Result       "mo:base/Result";
import Hash         "mo:base/Hash";
import Iter         "mo:base/Iter";
import Time         "mo:base/Time";

import Nat8      "mo:base/Nat8";
import Nat32     "mo:base/Nat32";
import Nat64     "mo:base/Nat64";
import Nat          "mo:base/Nat";

import  A         "../invoice/Account";

import Map             "mo:map/Map";
import Ref             "../Ref";

module {

    // for convenience
    type Invoice = Types.Invoice;

    type Ref<V>              = Ref.Ref<V>;
    type Map<K, V>           = Map.Map<K, V>;

    public class Invoices(_register:Map<Nat32, Types.Invoice>, _index: Ref<Nat32>) {

        public func set_state(initial:[Invoice]) : (){
            Map.clear(_register);            
            let initial_iter: Iter.Iter<Invoice> = Iter.fromArray<Invoice>(initial);
            for (invoice in initial_iter) {
                set_invoice(invoice);
            };
        };
       
        // --------------------- HELPER ---------------------
        
        // TODO: maybe delete
        public func validate_key(key:Nat32) : Bool {
            // if it does not exist yet, it is a valid key
            if(get_invoice(key) == null){ return true } 
            else { return false };
        };
        
        public func replace_question_id(prevInvoice: Invoice, question_id:Nat32) : Invoice {            
            return { prevInvoice with question_id = ?question_id };
        };
        
        // --------------------- CRUD ---------------------
        // create, update

        public func generate_id() : Nat32{
            let preCounter:Nat32 = _index.v;
            _index.v := _index.v + 1;
            return preCounter;
        };

        public func create_invoice(amount: Nat32, marketPrincipal: Principal, buyer_id:Principal): Invoice {
            let id = generate_id();
            let invoice : Invoice = {
                id;
                buyer_id; 
                question_id = null;
                amount;
                verifiedAtTime = null;
                paid = false;
                destination = A.getAccountId(Nat64.fromNat(Nat32.toNat(id)), Principal.toText(marketPrincipal));
                subAccount = A.getSubaccount(Nat64.fromNat(Nat32.toNat(id)));
            };
            set_invoice(invoice);
            return invoice;
        };

        public func put_invoice(invoice:Invoice) : ?Invoice {
            Map.put(_register, Map.n32hash, invoice.id, invoice);
        };  

        public func set_invoice(invoice:Invoice) : () {
            Map.set(_register, Map.n32hash, invoice.id, invoice);
        };  

        //  -------------------- BUSINESS LOGIC --------------------
        public func verify_invoice(preInvoice: Invoice) : Invoice {
            let newInvoice:Invoice = { 
                preInvoice with 
                    verifiedAtTime = ?Time.now(); 
                    paid = true;  
            };
            set_invoice(newInvoice);
            return newInvoice;
        };

         public func un_verify_invoice(preInvoice: Invoice) : Invoice {
            let newInvoice:Invoice = { 
                preInvoice with 
                    verifiedAtTime = null; 
                    paid = false;  
            };
            set_invoice(newInvoice);
            return newInvoice;
        };

        // --------------------- QUERIES ---------------------
        public func get_invoice(id:Nat32) : ?Invoice{
            Map.get(_register, Map.n32hash, id);
        };
        
        public func get_all_invoices() : [Invoice] {
            let iter = Map.vals(_register);
            return Iter.toArray<Invoice>(iter);        
        };
    };
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
  /*   public func init_invoices(_register:Map<Nat32, Types.Invoice>, _index: Ref<Nat32>, initial_invoices:?[Invoice]) : Invoices {
        let invoices: Invoices = Invoices(_register, _index);
        switch(initial_invoices){
            case(null){};
            case(?initial_invoices){
               let initial_invoice_iter: Iter.Iter<Invoice> = Iter.fromArray<Invoice>(initial_invoices);
                for (initial_invoice in initial_invoice_iter) {
                    invoices.set_invoice(initial_invoice);
                };
            };
        };
        return invoices;
    }; */