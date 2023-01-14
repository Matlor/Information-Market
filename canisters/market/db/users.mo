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
import Iter       "mo:base/Iter";
import Debug       "mo:base/Debug";



module {

    // for convenience
    type User = Types.User;

    public class Users() {

        // TODO: test profiles
        var profiles: Trie.Trie<Principal, ?Blob> = Trie.empty<Principal, ?Blob>();
        var users: Trie.Trie<Principal, User> = Trie.empty<Principal, User>();

        // overwrites the users var
        public func set_state(initial_users:[User]) : () {
            var newUsers: Trie.Trie<Principal, User> = Trie.empty<Principal, User>();

            let initial_user_iter: Iter.Iter<User> = Iter.fromArray<User>(initial_users);
            for (initial_user in initial_user_iter) {
                let (newTrie, prevValue) : (Trie.Trie<Principal, User>, ?User) = Trie.put(newUsers, {key=initial_user.id; hash=Principal.hash(initial_user.id)}, Principal.equal, initial_user);
                newUsers:= newTrie;
            };
            users:= newUsers;
        
        };
        
        // --------------------- HELPER ---------------------
        public func validate_key(key:Principal) : Bool {
            if(get_user(key) != null or Principal.isAnonymous(key)){return false}
            else {return true};
        };

        public func replace_invoice_ids(prevUser: User, invoice_id:Nat) : User {
            let prev_ids: Buffer.Buffer<Nat> = Buffer.fromArray(prevUser.invoices);
            prev_ids.add(invoice_id);
            let new_ids = Buffer.toArray(prev_ids);
            let newUser: User = {prevUser with invoices = new_ids};
            return newUser;
        };

        public func replace_answer_ids(prevUser: User, id:Text) : User {
            let prev_ids: Buffer.Buffer<Text> = Buffer.fromArray(prevUser.answers);
            prev_ids.add(id);
            let new_ids = Buffer.toArray(prev_ids);
            let newUser: User = { prevUser with answers = new_ids };
            return newUser;
        };

         public func replace_question_ids(prevUser: User, id:Text) : User {
            let prev_ids: Buffer.Buffer<Text> = Buffer.fromArray(prevUser.questions);
            prev_ids.add(id);
            let new_ids = Buffer.toArray(prev_ids);
            let newUser: User = { prevUser with questions = new_ids };
            return newUser;
        };

        // --------------------- CRUD ---------------------
        // get
        // create
        // update

        public func get_user(id:Principal) : ?User{
            Trie.get(users, {key=id; hash=Principal.hash(id)}, Principal.equal);
        };

        // TODO: test everything related to profiles
        public func put_user(user:User) : User {
            let (newTrie, prevValue) : (Trie.Trie<Principal, User>, ?User) = Trie.put(users, {key=user.id; hash=Principal.hash(user.id)}, Principal.equal, user);
            users:= newTrie;
            return user;
        };

        // TODO: I could use the put_user func instead
        // TODO: test this
        public func create_user(id:Principal, name:Text) : User {
            let newUser: User = {
                id; 
                name; 
                joined_date = Utils.time_minutes_now();
                invoices = []; 
                questions = [];
                answers = [];
            };
            let (newTrie, prevValue) : (Trie.Trie<Principal, User>, ?User) = Trie.put(users, {key=newUser.id; hash=Principal.hash(newUser.id)}, Principal.equal, newUser);
            users:= newTrie;
            let (newProfileTrue, prevProfile) : (Trie.Trie<Principal, ?Blob>, ??Blob) = Trie.put(profiles, {key=newUser.id; hash=Principal.hash(newUser.id)}, Principal.equal, null);
            profiles:= newProfileTrue;
            return newUser;            
        };

        // TODO: could be improved
        // TODO: test this
        public func update_user(id:Principal, name:Text): () {
            switch(get_user(id)){
                case(null){return};
                case(?user){
                    let newUser: User = {user with name = name};
                    ignore put_user(newUser);
                    return;                    
                };
            }
        };
       
        // ------------- Profiles -------------
        // TODO: test this
        public func put_profile(id:Principal, profile:Blob) : Blob {
            let (newTrie, prevValue) : (Trie.Trie<Principal, ?Blob>, ??Blob) = Trie.put(profiles, {key=id; hash=Principal.hash(id)}, Principal.equal, ?profile);
            profiles:= newTrie;
            return profile;
        };
        
        // TODO: test this
        public func update_profile(id:Principal, profile:Blob): () {
            switch(get_user(id)){
                case(null){return};
                case(?user){
                    ignore put_profile(id, profile);
                    return;                    
                };
            }
        };

        // --------------------- QUERIES ---------------------
        // TODO: maybe delete
        // TODO: test this
        public func get_all_users() : [User] {
            Trie.toArray<Principal, User, User>(users, func(pair:(Principal, User)): User { return pair.1 });
        };

        // TODO: test this
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

        // TODO: I want to differentiate between empty profile and non existing user
        // I get an optional value of an optional value back right now
        // I'd need to add an empty blob basically 
        public func get_profile(id: Principal) : ??Blob {
            Trie.get<Principal, ?Blob>(profiles, {key=id; hash=Principal.hash(id)}, Principal.equal);
        }; 
        
        // --------------------- UPGRADE ---------------------
        // TODO:
        public func share() : Trie.Trie<Principal, User> {
            users;
        };
    };
};

