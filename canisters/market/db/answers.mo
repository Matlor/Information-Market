import Types        "../types";
import Trie         "mo:base/Trie";
import Text         "mo:base/Text";
import Nat          "mo:base/Nat";
import Principal    "mo:base/Principal";
import Blob         "mo:base/Blob";
import Result       "mo:base/Result";
import Utils        "../utils";


module {

    type Answer = Types.Answer;

    public class Answers() {

        var answers: Trie.Trie<Text, Answer> = Trie.empty<Text, Answer>();

        var counter: Nat = 0;
        public func generate_id() : Text {
            counter := counter + 1;
            return Nat.toText(counter);
        };

        // --------------------- CRUD ---------------------
        // get
        // create
        // update: not needed
        // delete: not needed

        public func get_answer(id:Text) : ?Answer{
            Trie.get(answers, {key=id; hash=Text.hash(id)}, Text.equal);
        };

        public func create_answer(user_id:Principal, question_id:Text, content:Text) : Answer {
            let answer_id: Text = generate_id();
            let newAnswer: Answer = {
                id = answer_id;
                author_id = user_id;
                question_id;
                creation_date = Utils.time_minutes_now();
                content;
            };
            let (newTrie, prevValue) : (Trie.Trie<Text, Answer>, ?Answer) = Trie.put(answers, {key=newAnswer.id; hash=Text.hash(newAnswer.id)}, Text.equal, newAnswer);
            answers:= newTrie;
            return newAnswer;
        };

        // --------------------- UPGRADE ---------------------
         public func share() : Trie.Trie<Text, Answer> {
            answers;
        };
    };
};

