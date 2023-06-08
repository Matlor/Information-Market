import Types        "../types";
import Text         "mo:base/Text";
import Nat          "mo:base/Nat";
import Principal    "mo:base/Principal";
import Blob         "mo:base/Blob";
import Utils        "../utils";
import Buffer       "mo:base/Buffer";
import Iter         "mo:base/Iter";
import Debug        "mo:base/Debug";

import Map             "mo:map/Map";
import Ref             "../Ref";


module {

    type Ref<V>              = Ref.Ref<V>;
    type Map<K, V>           = Map.Map<K, V>;
    type Question = Types.Question;
    type FinalWinner = Types.FinalWinner;

    public class Questions(_register:Map<Nat32, Types.Question>, _index: Ref<Nat32>) {


        // TODO: DOES NOT WORK YET
        // TODO: careful if I pass several questions with the same id it might overwrite them simply
        // I should always assert the thing has the correct length
        public func set_state(initial:[Question]) :  () {
            Map.clear(_register);
            let initial_iter: Iter.Iter<Question> = Iter.fromArray<Question>(initial);
            for (question in initial_iter) {
                set_question(question);
            };
        };

        // --------------------- HELPERS ---------------------
        public func replace_answer_ids(prevQuestion: Question, answer_id:Nat32) : Question {
            let prev_ids: Buffer.Buffer<Nat32> = Buffer.fromArray(prevQuestion.answers);
            prev_ids.add(answer_id);
            let new_ids = Buffer.toArray(prev_ids);
            let newQuestion:Question = { prevQuestion with answers = new_ids; };
            return newQuestion;
        };

        public func has_answers(arr: [Nat32]): Bool {
            if(Iter.size(Iter.fromArray<Nat32>(arr)) > 0) {
                return true;
            } else {
                return false;
            }
        };

        // --------------------- CRUD ---------------------
        // create
        // get
        // update

        public func generate_id() : Nat32{
            let preCounter = _index.v;
            _index.v := _index.v + 1;
            return preCounter;
        };

         // TODO: I can use the put_question function here
        // when id is generated 'put' will certainly work (no need to return result)
        public func create_question(user_id:Principal, invoice_id:Nat32, duration_minutes:Int32, title:Text, content:Text, reward:Nat32) : Question {
            let now = Utils.time_minutes_now();
            let newQuestion: Question = {
                id = generate_id();
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
            set_question(newQuestion);
            return newQuestion;
        };

        public func set_question(question:Question) : () {
            Map.set(_register, Map.n32hash, question.id, question);
        };

        public func put_question(question:Question) : ?Question {
            Map.put(_register, Map.n32hash, question.id, question);
        };

        // --------------------- BUSINESS LOGIC ---------------------

        public func open_to_pickanswer(prevQuestion:Question, duration_pick_answer_:Int32) : Question {
            let newQuestion:Question = { 
                prevQuestion with status = #PICKANSWER; 
                status_update_date = Utils.time_minutes_now();  
                status_end_date = Utils.time_minutes_now() + duration_pick_answer_; 
            };
            set_question(newQuestion);
            return newQuestion;
        };

        public func pickanswer_to_disputable (prevQuestion:Question, duration_disputable_:Int32, answer_id:Nat32) : Question {
            let newQuestion:Question = { 
                prevQuestion with status = #DISPUTABLE; 
                status_update_date= Utils.time_minutes_now();  
                status_end_date = Utils.time_minutes_now() + duration_disputable_; 
                potentialWinner = ?answer_id;
            };
            set_question(newQuestion);
            return newQuestion;
        };

        // TODO: does it make sense to set status_end_date to 0?
        public func to_arbitration (prevQuestion:Question) : Question {
            let newQuestion:Question = { 
                prevQuestion with status = #ARBITRATION; 
                status_update_date = Utils.time_minutes_now();  
                // TODO:
                status_end_date:Int32 = 0;
            };
            set_question(newQuestion);
            return newQuestion;
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
            set_question(newQuestion);
            return newQuestion;
        };

        public func pay_to_ongoing(prevQuestion:Question) : Question {
            let newQuestion: Question = { 
                prevQuestion with status = #PAYOUT(#ONGOING); 
                status_update_date = Utils.time_minutes_now()
            };
            set_question(newQuestion);
            return newQuestion;
        };
   
        public func ongoing_to_pay(prevQuestion:Question) : Question {
            let newQuestion: Question = { 
                prevQuestion with status = #PAYOUT(#PAY); 
                status_update_date=Utils.time_minutes_now()
            };
            set_question(newQuestion);
            return newQuestion;
        };

        public func ongoing_to_close (prevQuestion:Question, close_transaction_block_height:Nat64) : Question {
            let newQuestion: Question = { 
                prevQuestion with status = #CLOSED; 
                status_update_date = Utils.time_minutes_now();
                close_transaction_block_height = ?close_transaction_block_height;
            };
            set_question(newQuestion);
            return newQuestion;
        };

        // --------------------- QUERIES ---------------------
        public func get_question(id:Nat32) : ?Question{
            Map.get(_register, Map.n32hash, id);
        };

        public func get_all_questions() : [Question] {
            let iter = Map.vals(_register);
            return Iter.toArray<Question>(iter);
        };

        public func get_unclosed_questions () : [Question] {
            let filteredQuestions:Map<Nat32, Question> = Map.filter(_register, Map.n32hash, 
                func(key: Nat32, val:Question):Bool{
                    if(val.status != #CLOSED){return true;} else {return false;}
                }
            );
            let iter = Map.vals(filteredQuestions);
            return Iter.toArray<Question>(iter);
        };

        public func get_conditional_questions(filters:Types.Filter_Options,search:Text, sort_by:Types.Sort_Options,  start:Nat32, length:Nat32) : [Question] {
            let selected_questions_by_reward = Buffer.Buffer<Question>(20);   
            let questions_iter = Map.vals(_register);

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

    };
};

