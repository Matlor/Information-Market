import Types        "../types";
import Text         "mo:base/Text";
import Nat          "mo:base/Nat";
import Principal    "mo:base/Principal";
import Blob         "mo:base/Blob";
import Result       "mo:base/Result";
import Utils        "../utils";
import Iter         "mo:base/Iter";
import Buffer        "mo:base/Buffer";

import Ref             "../Ref";
import Map             "mo:map/Map";


module {

    // for convenience
    type Answer = Types.Answer;
    type Ref<V>              = Ref.Ref<V>;
    type Map<K, V>           = Map.Map<K, V>;

    public class Answers(_register:Map<Nat32, Types.Answer>, _index: Ref<Nat32>) {

        public func set_state(initial:[Answer]) :  () {
            Map.clear(_register);
            let initial_iter: Iter.Iter<Answer> = Iter.fromArray<Answer>(initial);
            for (answer in initial_iter) {
                set_answer(answer);
            };
        };

        // --------------------- CRUD ---------------------
        // get
        // create

        public func generate_id() : Nat32{
            let preCounter = _index.v;
            _index.v := _index.v + 1;
            return preCounter;
        };

        public func create_answer(user_id:Principal, question_id:Nat32, content:Text) : Answer {
            let answer_id: Nat32 = generate_id();
            let newAnswer: Answer = {
                id = answer_id;
                author_id = user_id;
                question_id;
                creation_date = Utils.time_minutes_now();
                content;
            };
            set_answer(newAnswer);
            return newAnswer;
        };

        public func put_answer(answer:Answer) : ?Answer {
            Map.put(_register, Map.n32hash, answer.id, answer);
        };  

        public func set_answer(answer:Answer) : () {
            Map.set(_register, Map.n32hash, answer.id, answer);
        };  


        // --------------------- QUERIES ---------------------
        public func get_answer(id:Nat32) : ?Answer{
            Map.get(_register, Map.n32hash, id);
        };

        public func get_answers(answer_ids:[Nat32]) : [Answer] {
            let selected_answers = Buffer.Buffer<Answer>(answer_ids.size());   

            let answer_ids_iter = Iter.fromArray(answer_ids);
            for (answer_id in answer_ids_iter) {
                let answer = get_answer(answer_id);
                switch(answer){
                    case(null){};
                    case(?answer){
                        selected_answers.add(answer);
                    };
                };
            };
            return Buffer.toArray(selected_answers);
        };
        
        public func get_all_answers() : [Answer] {
            let iter = Map.vals(_register);
            return Iter.toArray<Answer>(iter);        
        };
    };
};


