import Types        "../types";
import Trie         "mo:base/Trie";
import Text         "mo:base/Text";
import Nat          "mo:base/Nat";
import Principal    "mo:base/Principal";
import Blob         "mo:base/Blob";
import Result       "mo:base/Result";
import Utils        "../utils";
import Iter         "mo:base/Iter";
import Buffer        "mo:base/Buffer";

module {

    // for convenience
    type Answer = Types.Answer;

    public func init_answers(initial_answers:?[Answer]) : Answers {
        let answers: Answers = Answers();
        switch(initial_answers){
            case(null){};
            case(?initial_answers){
               let initial_answers_iter: Iter.Iter<Answer> = Iter.fromArray<Answer>(initial_answers);
                for (initial_answers in initial_answers_iter) {
                    ignore answers.put_answer(initial_answers);
                };
            };
        };
        return answers;
    };

    public class Answers() {

        var answers: Trie.Trie<Text, Answer> = Trie.empty<Text, Answer>();

        public func set_state(initial:[Answer]) :  () {
            var newData: Trie.Trie<Text, Answer> = Trie.empty<Text, Answer>();
            let initial_iter: Iter.Iter<Answer> = Iter.fromArray<Answer>(initial);
            for (question in initial_iter) {
                let (newTrie, prevValue) : (Trie.Trie<Text, Answer>, ?Answer) = Trie.put(newData, {key=question.id; hash=Text.hash(question.id)}, Text.equal, question);
                newData:= newTrie;
            };
            answers:= newData;
        };

        // TODO: can't have stabel var here, this is a problem!
        var counter: Nat = 0;
        
        public func generate_id() : Text{
            let preCounter = counter;
            counter := counter + 1;
            return Nat.toText(preCounter);
        };

        // --------------------- CRUD ---------------------
        // get
        // create

        public func get_answer(id:Text) : ?Answer{
            Trie.get(answers, {key=id; hash=Text.hash(id)}, Text.equal);
        };

        // TODO: if I had the put function seperate (like the others) I could use it
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

         public func put_answer(answer:Answer) : Answer {
            let (newTrie, prevValue) : (Trie.Trie<Text, Answer>, ?Answer) = Trie.put(answers, {key=answer.id; hash=Text.hash(answer.id)}, Text.equal, answer);
            answers:= newTrie;
            return answer;
        };  

        // --------------------- QUERIES ---------------------
        public func get_answers(answer_ids:[Text]) : [Answer] {
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
            Trie.toArray<Text, Answer, Answer>(answers, func(pair:(Text, Answer)):Answer { return pair.1 });
        };

        // --------------------- UPGRADE ---------------------
        // TODO:
         public func share() : Trie.Trie<Text, Answer> {
            answers;
        };
    };
};

