import Types        "../types";
import Trie         "mo:base/Trie";
import Text         "mo:base/Text";
import Nat          "mo:base/Nat";
import Principal    "mo:base/Principal";
import Blob         "mo:base/Blob";
import Result       "mo:base/Result";
import Utils        "../utils";
import Buffer       "mo:base/Buffer";


module {

    type User = Types.User;

    public class Users() {

        var users: Trie.Trie<Principal, User> = Trie.empty<Principal, User>();
        
        // --------------------- HELPER ---------------------
        public func validate_key(key:Principal) : Bool {
            if(get_user(key) == null or Principal.isAnonymous(key)){return false}
            else {return true};
        };

        public func replace_invoice_ids(prevUser: User, id:Text) : User {
    
            let prev_ids: Buffer.Buffer<Text> = Buffer.fromArray(prevUser.invoices);
            prev_ids.add(id);
            let new_ids = Buffer.toArray(prev_ids);

            let newUser: User = {
                id = prevUser.id; 
                name = prevUser.name; 
                joined_date = prevUser.joined_date;
                avatar = prevUser.avatar;
                invoices = new_ids; 
                questions = prevUser.questions; 
                answers = prevUser.answers;
            };
            return newUser;
        };

        public func replace_answer_ids(prevUser: User, id:Text) : User {
    
            let prev_ids: Buffer.Buffer<Text> = Buffer.fromArray(prevUser.answers);
            prev_ids.add(id);
            let new_ids = Buffer.toArray(prev_ids);

            let newUser: User = {
                id = prevUser.id; 
                name = prevUser.name; 
                joined_date = prevUser.joined_date;
                avatar = prevUser.avatar;
                invoices = prevUser.invoices; 
                questions = prevUser.questions;
                answers = new_ids
            };
            return newUser;
        };

         public func replace_question_ids(prevUser: User, id:Text) : User {
    
            let prev_ids: Buffer.Buffer<Text> = Buffer.fromArray(prevUser.questions);
            prev_ids.add(id);
            let new_ids = Buffer.toArray(prev_ids);

            let newUser: User = {
                id = prevUser.id; 
                name = prevUser.name; 
                joined_date = prevUser.joined_date;
                avatar = prevUser.avatar;
                invoices = prevUser.invoices; 
                questions = new_ids;
                answers = prevUser.answers;
            };
            return newUser;
        };

        // --------------------- CRUD ---------------------
        // get
        // create
        // update
        // delete: not needed

        public func get_user(id:Principal) : ?User{
            Trie.get(users, {key=id; hash=Principal.hash(id)}, Principal.equal);
        };

        public func create_user(id:Principal, name:Text) : User {
            let newUser: User = {
                id; 
                name; 
                joined_date = Utils.time_minutes_now();
                avatar = null;
                invoices = []; 
                questions = [];
                answers = [];
            };
            let (newTrie, prevValue) : (Trie.Trie<Principal, User>, ?User) = Trie.put(users, {key=newUser.id; hash=Principal.hash(newUser.id)}, Principal.equal, newUser);
            users:= newTrie;
            return newUser;            
        };

        public func update_user(user:User) : Result.Result<User, Types.StateError> {
           switch(get_user(user.id)) {
                case (null) { 
                    return #err(#UserNotFound) 
                };
                case (?val) { 
                    let (newTrie, prevValue) : (Trie.Trie<Principal, User>, ?User) = Trie.put(users, {key=user.id; hash=Principal.hash(user.id)}, Principal.equal, user);
                    users:= newTrie;
                    return #ok(user);
                };
            };
        };

        // --------------------- UPGRADE ---------------------
        public func share() : Trie.Trie<Principal, User> {
            users;
        };
    };
};

