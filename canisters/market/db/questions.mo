import Types        "../types";
import Trie         "mo:base/Trie";
import Text         "mo:base/Text";
import Nat          "mo:base/Nat";
import Principal    "mo:base/Principal";
import Blob         "mo:base/Blob";
import Utils        "../utils";
import Buffer       "mo:base/Buffer";
import Iter         "mo:base/Iter";
import Debug        "mo:base/Debug";

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

        // TODO: careful if I pass several questions with the same id it might overwrite them simply
        // I should always assert the thing has the correct length
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
        public func create_question(user_id:Principal, invoice_id:Nat32, duration_minutes:Int32, title:Text, content:Text, reward:Nat32) : Question {
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
  
        public func open_to_pickanswer(prevQuestion:Question, duration_pick_answer_:Int32) : Question {
            let newQuestion:Question = { 
                prevQuestion with status = #PICKANSWER; 
                status_update_date = Utils.time_minutes_now();  
                status_end_date = Utils.time_minutes_now() + duration_pick_answer_; 
            };
            return put_question(newQuestion);
        };

        public func pickanswer_to_disputable (prevQuestion:Question, duration_disputable_:Int32, answer_id:Text) : Question {
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
                // TODO:
                status_end_date:Int32 = 0;
            };
            return put_question(newQuestion);
        };

        // TODO: set status_end_date to null if not needed, if that makes sense
        public func to_payout (prevQuestion:Question, finalWinner:FinalWinner) : Question {
            let newQuestion:Question = { 
                prevQuestion with status = #PAYOUT(#PAY);
                status_update_date = Utils.time_minutes_now(); 
                // TODO:
                status_end_date:Int32 = 0;
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
        
        public func get_all_questions() : [Question] {
            Trie.toArray<Text, Question, Question>(questions, func(pair:(Text,Question)):Question { return pair.1 });
        };

        public func get_unclosed_questions () : [Question] {
            let filteredQuestions: Trie.Trie<Text, Question> = Trie.filter<Text, Question>(questions, func(pair:(Text, Question)):Bool{
                if(pair.1.status != #CLOSED){return true;} else {return false;}
            });
            Trie.toArray<Text, Question, Question>(filteredQuestions, func(pair:(Text, Question)):Question { pair.1 });
        };

        // TODO: Test this function
        public func get_conditional_questions(filters:Types.Filter_Options,search:Text, sort_by:Types.Sort_Options,  start:Nat32, length:Nat32) : [Question] {
            
            let selected_questions_by_reward = Buffer.Buffer<Question>(20);   
        
            let questions_array = Trie.toArray<Text, Question, Question>(questions, func(pair:(Text, Question)):Question { return pair.1 });
            let questions_iter = Iter.fromArray<Question>(questions_array);
            label l for (question in questions_iter) {
                var is_satisfied = false;
                if(filters.open and question.status == #OPEN) { is_satisfied:=true; } else
                if(filters.pickanswer and question.status == #PICKANSWER) { is_satisfied:=true; } else 
                if(filters.disputable and question.status == #DISPUTABLE) { is_satisfied:=true; } else 
                if(filters.arbitration and question.status == #ARBITRATION) { is_satisfied:=true; } else 
                if(filters.payout and (question.status == #PAYOUT(#PAY) or question.status == #PAYOUT(#ONGOING))) { is_satisfied:=true; } else 
                if(filters.closed and question.status == #CLOSED) { is_satisfied:=true; };
                if(is_satisfied == false){continue l};
                // TODO: check if empty string always satisfies
                if(Text.contains(question.title, #text(search)) or Text.contains(question.content, #text(search))) {
                    is_satisfied:=true;
                } else {
                    is_satisfied:=false;
                };

                if(is_satisfied){ selected_questions_by_reward.add(question) };
            }; 

            return Buffer.toArray(selected_questions_by_reward);
        };

        // --------------------- UPGRADE ---------------------
        // TODO:
        public func share() : Trie.Trie<Text, Question> {
            questions;
        };
    };
};

