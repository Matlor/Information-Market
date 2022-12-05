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

    type Question = Types.Question;

    public class Questions() {

        var questions: Trie.Trie<Text, Question> = Trie.empty<Text, Question>();
    
        var counter: Nat = 0;
        public func generate_id() : Text{
            counter := counter + 1;
            return Nat.toText(counter);
        };

        // --------------------- HELPERS ---------------------

         public func replace_answer_ids(prevQuestion: Question, id:Text) : Question {
    
            let prev_ids: Buffer.Buffer<Text> = Buffer.fromArray(prevQuestion.answers);
            prev_ids.add(id);
            let new_ids = Buffer.toArray(prev_ids);

            let newQuestion: Question = {
                id = prevQuestion.id;
                author_id = prevQuestion.author_id;
                invoice_id = prevQuestion.invoice_id;
                creation_date = prevQuestion.creation_date;
                status = prevQuestion.status;
                status_update_date = prevQuestion.status_update_date;
                status_end_date = prevQuestion.status_end_date;
                open_duration = prevQuestion.open_duration;
                title = prevQuestion.title;
                content = prevQuestion.content;
                reward = prevQuestion.reward;
                winner = prevQuestion.winner;
                close_transaction_block_height = prevQuestion.close_transaction_block_height;
                answers = new_ids;
            };
            return newQuestion;
        };


        // --------------------- CRUD ---------------------
        // get
        // create
        // update
        // delete: not needed

        public func get_question(id:Text) : ?Question{
            Trie.get(questions, {key=id; hash=Text.hash(id)}, Text.equal);
        };

        // when id is generated 'put' will certainly work (no need to return result)
        public func create_question(user_id:Principal, invoice_id:Text, duration_minutes:Int, title:Text, content:Text, reward:Int) : Question {
            let now = Utils.time_minutes_now();
            let id: Text = generate_id();
            let newQuestion: Question = {
                id;
                author_id = user_id;
                invoice_id;
                creation_date = now;
                status = #OPEN;
                status_update_date = now;
                status_end_date = now + duration_minutes;
                open_duration =  duration_minutes;
                title;
                content;
                reward;
                winner = null; 
                close_transaction_block_height= null;
                answers = []; 
            };
            let (newTrie, prevValue) : (Trie.Trie<Text, Question>, ?Question) = Trie.put(questions, {key=newQuestion.id; hash=Text.hash(newQuestion.id)}, Text.equal, newQuestion);
            questions:= newTrie;
            return newQuestion;
        };

        public func update_question(question:Question) : Result.Result<Question, Types.StateError> {
           switch(get_question(question.id)) {
                case (null) { 
                    return #err(#QuestionNotFound) 
                };
                case (?val) { 
                    let (newTrie, prevValue) : (Trie.Trie<Text, Question>, ?Question) = Trie.put(questions, {key=question.id; hash=Text.hash(question.id)}, Text.equal, question);
                    questions:= newTrie;
                    return #ok(question);
                };
            };
        };

        // --------------------- UPGRADE ---------------------
         public func share() : Trie.Trie<Text, Question> {
            questions;
        };
    };
};

