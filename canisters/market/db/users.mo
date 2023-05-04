import Types        "../types";
import Trie         "mo:base/Trie";
import Text         "mo:base/Text";
import Nat          "mo:base/Nat";
import Principal    "mo:base/Principal";
import Blob         "mo:base/Blob";
import Result       "mo:base/Result";
import Utils        "../utils";
import Buffer       "mo:base/Buffer";
import Array       "mo:base/Array";
import Iter             "mo:base/Iter";
import Debug           "mo:base/Debug";

import Map             "mo:map/Map";
import Ref             "../Ref";

module {

    // for convenience
    type User = Types.User;
    type Map<K, V>           = Map.Map<K, V>;
    type Ref<V>              = Ref.Ref<V>;

    public class Users(_register:Map<Principal, Types.User>) {

        public func set_state(initial_users:[User]) : () {
            Map.clear(_register);
            let initial_user_iter: Iter.Iter<User> = Iter.fromArray<User>(initial_users);
            for (initial_user in initial_user_iter) {
                set_user(initial_user);
            };
        };
        
        // --------------------- HELPER ---------------------
        public func validate_key(key:Principal) : Bool {
            if(get_user(key) != null or Principal.isAnonymous(key)){return false}
            else {return true};
        };

        public func replace_invoice_ids(prevUser: User, invoice_id:Nat32) : User {
            let prev_ids: Buffer.Buffer<Nat32> = Buffer.fromArray(prevUser.invoices);
            prev_ids.add(invoice_id);
            let new_ids = Buffer.toArray(prev_ids);
            let newUser: User = {prevUser with invoices = new_ids};
            return newUser;
        };

        public func replace_answer_ids(prevUser: User, id:Nat32) : User {
            let prev_ids: Buffer.Buffer<Nat32> = Buffer.fromArray(prevUser.answers);
            prev_ids.add(id);
            let new_ids = Buffer.toArray(prev_ids);
            let newUser: User = { prevUser with answers = new_ids };
            return newUser;
        };

         public func replace_question_ids(prevUser: User, id:Nat32) : User {
            let prev_ids: Buffer.Buffer<Nat32> = Buffer.fromArray(prevUser.questions);
            prev_ids.add(id);
            let new_ids = Buffer.toArray(prev_ids);
            let newUser: User = { prevUser with questions = new_ids };
            return newUser;
        };

        // --------------------- CRUD ---------------------
        // get
        // create
        // update

        public func create_user(id:Principal) : User {
            let newUser: User = {
                id; 
                joined_date = Utils.time_minutes_now();
                invoices = []; 
                questions = [];
                answers = [];
            };
            set_user(newUser);
            return newUser;
        };

        public func set_user(user:User) : () {
            Map.set(_register, Map.phash, user.id, user);
        };

        public func put_user(user:User) : ?User {
            Map.put(_register, Map.phash, user.id, user);
        };


        // --------------------- QUERIES ---------------------
        public func get_user(id:Principal) : ?User{
            Map.get(_register, Map.phash, id);
        };

        public func get_all_users() : [User] {
            let iter = Map.vals(_register);
            return Iter.toArray<User>(iter);
        };

        public func get_users(user_ids:[Principal]) : [User] {
            let selected_users = Buffer.Buffer<User>(user_ids.size());               
            let user_ids_iter = Iter.fromArray(user_ids);
            for (user_id in user_ids_iter) {
                let user = get_user(user_id);
                switch(user){
                    case(null){
                    };
                    case(?user){
                        selected_users.add(user);
                    };
                };
            };
            return Buffer.toArray(selected_users);
        };
    };
};

