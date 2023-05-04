import UsersModule       "users";
import InvoicesModule    "invoices";
import QuestionsModule   "questions";
import AnswersModule     "answers";
import Types             "../types";

import Result            "mo:base/Result";
import Array             "mo:base/Array";
import Iter              "mo:base/Iter";
import Buffer            "mo:base/Buffer";
import Principal         "mo:base/Principal";
import Prelude           "mo:base/Prelude";
import Debug             "mo:base/Debug";
import Order             "mo:base/Order";
import Text              "mo:base/Text";
import Nat32             "mo:base/Nat32";

import State            "../state";

module {
    
    // for convenience
    type Question = Types.Question;
    type User = Types.User;
    type Invoice = Types.Invoice;
    type Answer = Types.Answer;

    // TODO: delete
    type State = Types.State;
    type StabelState = State.State;


    public class DB(_state: StabelState){
        
        // --------------------------- STATE ---------------------------
        public func set_inner_state(state:State) : () {
            users.set_state(state.users_state);
            invoices.set_state(state.invoices_state);
            questions.set_state(state.questions_state);
            answers.set_state(state.answers_state);
        };
        
        private var users: UsersModule.Users = UsersModule.Users(_state.users.register);
        private var invoices: InvoicesModule.Invoices = InvoicesModule.Invoices(_state.invoices.register, _state.invoices.index);
        private var questions: QuestionsModule.Questions = QuestionsModule.Questions(_state.questions.register, _state.questions.index);
        private var answers: AnswersModule.Answers = AnswersModule.Answers(_state.answers.register, _state.answers.index);

        // --------------------------- DB FUNCTIONS ---------------------------
        
        // TODO: rename the func so that not both are called "create_user"
        public func create_user(id:Principal) : Result.Result<User, Types.Error> {
            // if user does not exist yet and is !ananymous
            if(not users.validate_key(id)){
                return #err(#UserIsInvalid);
            } else {
                return #ok(users.create_user(id));
            };
        }; 
        

        // checks if the user exists
        // create invoice -> requires buyer id
        // add the invoice id to the user by replacing the user
        public func create_invoice(amount:Nat32, marketPrincipal:Principal, buyer_id:Principal) : Result.Result<Invoice, Types.Error> {
            switch(users.get_user(buyer_id)){
                case(null){return #err(#UserNotFound)};
                case(?user){
                    let invoice: Invoice = invoices.create_invoice(amount, marketPrincipal, buyer_id);
                    ignore users.put_user(users.replace_invoice_ids(user, invoice.id));
                    return #ok(invoice);
                };
            };
        };

        // Adding a question:
        // generating a new id -> where does that happen?
        // adding the q to questions
        // adding question_id to specific user as id
        // generate unique question id
        // 1) does user exists
        // 2) does invoice exist
        // assumes that further above it is checked that invoice did not yet have this id
        // TODO: Question should point to invoice to check quickly if invoice has been used for question already
        // TODO: Do I have to pass the reward? Should it be int or nat?
        // TO DO: the switches are independent and can be refactored (readability)
        public func create_question(user_id:Principal, invoice_id:Nat32, duration_minutes:Int32, title:Text, content:Text, reward:Nat32) : Result.Result<Question, Types.Error> {
            switch(invoices.get_invoice(invoice_id)){
                case(null){ return #err(#InvoiceNotFound) };
                case(?invoice){
                    switch(users.get_user(user_id)){
                        case(null){ return #err(#UserNotFound) };
                        case(?user){
                            let question: Question = questions.create_question(user_id:Principal, invoice_id:Nat32, duration_minutes:Int32, title:Text, content:Text, reward:Nat32);
                            ignore invoices.put_invoice(invoices.replace_question_id(invoice, question.id));
                            ignore users.put_user(users.replace_question_ids(user, question.id));
                            return #ok(question);
                        };
                    };
                };
            };
        };

        
        // Adding an answer:
        // does question exists
        // does user exists
        // generate new id
        // add to the answer
        // replace question to add id
        // user question to add id
        public func create_answer(user_id:Principal, question_id:Nat32, content:Text) : Result.Result<Answer, Types.Error> {
            switch(users.get_user(user_id)){
                case(null){return #err(#UserNotFound)};
                case(?prevUser){
                    switch(questions.get_question(question_id)){
                        case(null){ return #err(#AnswerNotFound);};
                        case(?prevQuestion){
                            // Add answer to answers
                            let answer: Answer = answers.create_answer(user_id:Principal, question_id:Nat32, content:Text);
                            
                            // replace question
                            ignore questions.put_question(questions.replace_answer_ids(prevQuestion, answer.id));
                        
                            // replace user
                            ignore users.put_user(users.replace_answer_ids(prevUser, answer.id));
                            return #ok(answer);
                        };   
                    };
                };
            };
        };

        // --------- DB helper functions ---------
        // TODO: possibly rebuild this based on other queries
        public func has_user_answered_question(user_id: Principal, question_id:Nat32): Bool {
            switch(questions.get_question(question_id)){
                case(null){false};
                case(?question){
                    let iter: Iter.Iter<Nat32> = Iter.fromArray(question.answers);
                    label l for (answer_id in iter){
                        switch(answers.get_answer(answer_id)){
                            case(null){return false};
                            case(?answer){
                                if(answer.author_id == user_id){
                                    return true;
                                } else {
                                    continue l;
                                };
                            }
                        };
                    };
                    return false;
                };
            };
        };
        // --------------------------- QUERIES ---------------------------
        // TODO: 
        public func get_state(): State {
            {
                users_state = users.get_all_users();
                invoices_state = invoices.get_all_invoices();
                questions_state = questions.get_all_questions();
                answers_state = answers.get_all_answers();
            };
        };

        // TODO: improve this function massively and test it
        // TODO: potentially replace with several specific queries
        public func get_question_data(question_id:Nat32): ?{question:Question; users:[User]; answers:[Answer]} {
            switch(questions.get_question(question_id)){
                case(null){return null};
                case(?question){
                    let answers_data: [Answer] = answers.get_answers(question.answers);
                    let sorted_answers_data = Array.sort(answers_data, func compare(a:Answer, b:Answer):Order.Order {
                        if(a.creation_date > b.creation_date){
                            return #greater;
                        } else if(a.creation_date < b.creation_date){
                            return #less;
                        } else {
                            return #equal;
                        };
                    });

                    // TODO: rename the vars (a, b, t)
                    // get all involved users (buffer/array transformation is annyoing)
                    let a = Array.map<Answer, Principal>(sorted_answers_data, func(answer): Principal {answer.author_id});
                    let b = Buffer.fromArray<Principal>(a);
                    b.add(question.author_id);

                    let t = users.get_users(Buffer.toArray<Principal>(b));
                    let users_data = users.get_users(Buffer.toArray<Principal>(b));

                    return ?{question; users=users_data; answers=sorted_answers_data};
                };      
            };
        };

        public func get_conditional_questions_with_authors(filters:Types.Filter_Options,search:Text, myInteractions:?Principal, sort_by:Types.Sort_Options,  start_:Nat32, length_:Nat32) : {data:[{question:Question; author:User}]; num_questions:Nat32} {
            let start = Nat32.toNat(start_);
            let length:Nat = Nat32.toNat(length_);
            
            var cond_questions = questions.get_conditional_questions(filters:Types.Filter_Options,search:Text, sort_by:Types.Sort_Options, start_:Nat32, length_:Nat32);

            // TODO: big problem, we already filtered here with the index, this should happen here instead
            cond_questions := Array.filter<Question>(cond_questions, 
                func(question): Bool {
                    switch(myInteractions){
                        case(null){return true};
                        case(?myInteractions){
                            if(has_user_answered_question(myInteractions, question.id)==true or question.author_id == myInteractions){
                                return true;
                            } else {
                                return false;
                            };
                        };
                    };
                } 
            );

             // --------- SORT ---------

              // TODO: I could always sort in a next step and even keep this separate functions entirely.
            func compare_by_reward_asc (a:Question, b:Question) : Order.Order {
                if(a.reward == b.reward){ 
                    // TODO: does not work for text
                    return Nat32.compare(a.id, b.id);
                } else if(a.reward > b.reward){
                    return #greater
                } else {
                    return #less
                };
            }; 

            func compare_by_reward_desc (a:Question, b:Question) : Order.Order {
                if(a.reward == b.reward){ 
                    // TODO: does not work for text
                    return Nat32.compare(a.id, b.id);
                } else if(a.reward < b.reward){
                    return #greater
                } else {
                    return #less
                };
            }; 

            func compare_by_time_left_asc (a:Question, b:Question) : Order.Order {
                if(a.status_end_date == b.status_end_date){ 
                     return #equal;
                } else if(a.status_end_date > b.status_end_date){
                    return #greater
                } else {
                    return #less
                };
            }; 

            func compare_by_time_left_desc (a:Question, b:Question) : Order.Order {
                if(a.status_end_date == b.status_end_date){ 
                     return #equal;
                } else if(a.status_end_date < b.status_end_date){
                    return #greater
                } else {
                    return #less
                };
            }; 

            let buf = Buffer.fromArray<Question>(cond_questions);

            if(sort_by == #REWARD(#ASCD)){ buf.sort(compare_by_reward_asc)} else 
            if(sort_by == #REWARD(#DESCD)){buf.sort(compare_by_reward_desc)} else 
            if(sort_by == #TIME_LEFT(#ASCD)){buf.sort(compare_by_time_left_asc)} else
            if(sort_by == #TIME_LEFT(#DESCD)){buf.sort(compare_by_time_left_desc)};

            let num_questions = buf.size();            

             // --------- INDEX ---------
            func get_sub_buffer(buf:Buffer.Buffer<Question>, start_:Nat32, length_:Nat32) : Buffer.Buffer<Question> {
                let size = buf.size();
            
                if(start < size and start+length <= size){
                    return Buffer.subBuffer(buf, start, length);
                } else if (start < size and start+length > size){
                    let remainder:Nat = size-start;
                    return Buffer.subBuffer(buf, start, remainder);
                } else {
                    return Buffer.Buffer<Question>(0);
                };
            };

            let sub_buf = get_sub_buffer(buf, start_, length_);
            let arr = Buffer.toArray(sub_buf);

            // ------- GET AUTHORS ----------
            let questions_with_authors = Array.map<Question,{question:Question; author:User }>(arr, 
                func(question): {question:Question; author:User} {
                    let author = users.get_user(question.author_id);
                    switch(author){
                        case(null){Prelude.unreachable()};
                        case(?author){
                            return {question; author};
                        };
                    };
                } 
            );

            // TODO: improve this (is to simplify frontend)
            let num_question_nat32 = Nat32.fromNat(num_questions);

            return {data=questions_with_authors; num_questions=num_question_nat32};
        };

        // --------------------------- RE-EXPORT ---------------------------
        public let Users = object {
            public let { get_user } = users;
            public let { get_all_users } = users;
            public let { get_users } = users;   
        };

        public let Invoices = object {
            public let { get_invoice } = invoices;
            public let { verify_invoice } = invoices;
            public let { un_verify_invoice } = invoices;
        };

        public let Questions = object {
            public let { get_question } = questions;
            public let { get_unclosed_questions } = questions;
            public let { get_conditional_questions } = questions;
            public let { has_answers } = questions;
            public let { open_to_pickanswer } = questions;
            public let { pickanswer_to_disputable } = questions;
            public let { to_arbitration } = questions;
            public let { to_payout } = questions;
            public let { pay_to_ongoing } = questions;
            public let { ongoing_to_pay } = questions;
            public let { ongoing_to_close } = questions;
        };

        public let Answers = object {
            public let { get_answer } = answers;
            public let { get_all_answers } = answers;
            
        };        
    };
};