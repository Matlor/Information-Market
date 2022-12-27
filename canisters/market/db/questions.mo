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

module {

    type Question = Types.Question;
    type FinalWinner = Types.FinalWinner;

    public func init_questions(initial_questions:?[Question]) : Questions {
        let questions: Questions = Questions();
        switch(initial_questions){
            case(null){};
            case(?initial_questions){
               let initial_question_iter: Iter.Iter<Question> = Iter.fromArray<Question>(initial_questions);
                for (initial_question in initial_question_iter) {
                    ignore questions.put_question(initial_question);
                };
            };
        };
        return questions;
    };

    public class Questions() {

        var questions: Trie.Trie<Text, Question> = Trie.empty<Text, Question>();

        public func set_state(initial:[Question]) :  () {
            var newData: Trie.Trie<Text, Question> = Trie.empty<Text, Question>();
            let initial_iter: Iter.Iter<Question> = Iter.fromArray<Question>(initial);
            for (question in initial_iter) {
                let (newTrie, prevValue) : (Trie.Trie<Text, Question>, ?Question) = Trie.put(newData, {key=question.id; hash=Text.hash(question.id)}, Text.equal, question);
                newData:= newTrie;
            };
            questions:= newData;

        };


    
        // TODO: should not start from 1
        // TODO: can't have stabel var here, this is a problem!
        var counter: Nat = 0;
        public func generate_id() : Text{
            let preCounter = counter;
            counter := counter + 1;
            return Nat.toText(preCounter);
        };

        // --------------------- HELPERS ---------------------
        public func replace_answer_ids(prevQuestion: Question, answer_id:Text) : Question {
            let prev_ids: Buffer.Buffer<Text> = Buffer.fromArray(prevQuestion.answers);
            prev_ids.add(answer_id);
            let new_ids = Buffer.toArray(prev_ids);
            let newQuestion:Question = { prevQuestion with answers = new_ids; };
            return newQuestion;
        };

        public func has_answers(arr: [Text]): Bool {
            if(Iter.size(Iter.fromArray<Text>(arr)) > 0) {
                return true;
            } else {
                return false;
            }
        };

        // --------------------- CRUD ---------------------
        // get
        // create
        // update

        public func get_question(id:Text) : ?Question{
            Trie.get(questions, {key=id; hash=Text.hash(id)}, Text.equal);
        };

        // TODO: I can use the put_question function here
        // when id is generated 'put' will certainly work (no need to return result)
        public func create_question(user_id:Principal, invoice_id:Nat, duration_minutes:Int, title:Text, content:Text, reward:Int32) : Question {
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
                potentialWinner = null; 
                finalWinner = null;
                close_transaction_block_height= null;
                answers = []; 
            };
            let (newTrie, prevValue) : (Trie.Trie<Text, Question>, ?Question) = Trie.put(questions, {key=newQuestion.id; hash=Text.hash(newQuestion.id)}, Text.equal, newQuestion);
            questions:= newTrie;
            return newQuestion;
        };

        public func put_question(question:Question) : Question {
            let (newTrie, prevValue) : (Trie.Trie<Text, Question>, ?Question) = Trie.put(questions, {key=question.id; hash=Text.hash(question.id)}, Text.equal, question);
            questions:= newTrie;
            return question;
        };

        // --------------------- BUSINESS LOGIC ---------------------
  
        public func open_to_pickanswer(prevQuestion:Question, duration_pick_answer_:Int) : Question {
            let newQuestion:Question = { 
                prevQuestion with status = #PICKANSWER; 
                status_update_date= Utils.time_minutes_now();  
                status_end_date = Utils.time_minutes_now() + duration_pick_answer_; 
            };
            return put_question(newQuestion);
        };

        public func pickanswer_to_disputable (prevQuestion:Question, duration_disputable_:Int, answer_id:Text) : Question {
            let newQuestion:Question = { 
                prevQuestion with status = #DISPUTABLE; 
                status_update_date= Utils.time_minutes_now();  
                status_end_date = Utils.time_minutes_now() + duration_disputable_; 
                potentialWinner = ?answer_id;
            };
            return put_question(newQuestion);
        };

        // TODO: does it make sense to set status_end_date to 0?
        public func to_arbitration (prevQuestion:Question) : Question {
            let newQuestion:Question = { 
                prevQuestion with status = #ARBITRATION; 
                status_update_date = Utils.time_minutes_now();  
                status_end_date = 0;
            };
            return put_question(newQuestion);
        };

        // TODO: set status_end_date to null if not needed, if that makes sense
        public func to_payout (prevQuestion:Question, finalWinner:FinalWinner) : Question {
            let newQuestion:Question = { 
                prevQuestion with status = #PAYOUT(#PAY);
                status_update_date = Utils.time_minutes_now(); 
                status_end_date = 0;
                finalWinner = ?finalWinner;
            };
            return put_question(newQuestion);
        };


        public func pay_to_ongoing(prevQuestion:Question) : Question {
            let newQuestion: Question = { 
                prevQuestion with status = #PAYOUT(#ONGOING); 
                status_update_date = Utils.time_minutes_now()
            };
            return put_question(newQuestion);
        };
   
        public func ongoing_to_pay(prevQuestion:Question) : Question {
            let newQuestion: Question = { 
                prevQuestion with status = #PAYOUT(#PAY); 
                status_update_date=Utils.time_minutes_now()
            };
            return put_question(newQuestion);
        };

        public func ongoing_to_close (prevQuestion:Question, close_transaction_block_height:Nat64) : Question {
            let newQuestion: Question = { 
                prevQuestion with status = #CLOSED; 
                status_update_date = Utils.time_minutes_now();
                close_transaction_block_height = ?close_transaction_block_height;
            };
            return put_question(newQuestion);
        };

        // --------------------- QUERIES ---------------------
        
        public func get_questions() : [Question] {
            Trie.toArray<Text, Question, Question>(questions, func(pair:(Text,Question)):Question { return pair.1 });
        };

        public func get_unclosed_questions () : [Question] {
            let filteredQuestions: Trie.Trie<Text, Question> = Trie.filter<Text, Question>(questions, func(pair:(Text, Question)):Bool{
                if(pair.1.status != #CLOSED){return true;} else {return false;}
            });
            Trie.toArray<Text, Question, Question>(filteredQuestions, func(pair:(Text, Question)):Question { pair.1 });
        };

        // TODO: possibly delete (not used currently)
        /* public func get_unclosed_question_ids () : [Text] {
            let filteredQuestions: Trie.Trie<Text, Question> = Trie.filter<Text, Question>(questions, func(pair:(Text, Question)):Bool{
                if(pair.1.status != #CLOSED){return true;} else {return false;}
            });
            Trie.toArray<Text, Question, Text>(filteredQuestions, func(pair:(Text, Question)):Text { pair.1.id });
        }; */

        // --------------------- UPGRADE ---------------------
        // TODO:
        public func share() : Trie.Trie<Text, Question> {
            questions;
        };
    };
};

