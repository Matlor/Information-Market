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

        // TODO: I could use the put_user func instead
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

        public func put_user(user:User) : User {
            let (newTrie, prevValue) : (Trie.Trie<Principal, User>, ?User) = Trie.put(users, {key=user.id; hash=Principal.hash(user.id)}, Principal.equal, user);
            users:= newTrie;
            return user;
        };

        // --------------------- QUERIES ---------------------
        public func get_users() : [User] {
            Trie.toArray<Principal, User, User>(users, func(pair:(Principal, User)): User { return pair.1 });
        };

        // --------------------- UPGRADE ---------------------
        // TODO:
        public func share() : Trie.Trie<Principal, User> {
            users;
        };
    };
};

