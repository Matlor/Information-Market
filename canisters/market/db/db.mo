import UsersModule       "users";
import InvoicesModule    "invoices";
import QuestionsModule   "questions";
import AnswersModule     "answers";
import Types             "../types";

import Result            "mo:base/Result";
import Array             "mo:base/Array";
import Iter              "mo:base/Iter";

module {
    
    // for convenience
    type Question = Types.Question;
    type User = Types.User;
    type Invoice = Types.Invoice;
    type Answer = Types.Answer;
    type State = Types.State;

    // I might need this on the actor -> I create a new db within the func
    // then I replace it's variables by calling a func on it. 
   /*  public func set_db(state:State) : Result.Result<(), Types.StateError> {

        ignore UsersModule.set(state.users_state);
        ignore InvoicesModule.init_invoices(state.invoices_state);
        ignore QuestionsModule.init_questions(state.questions_state);
        ignore AnswersModule.init_answers(state.answers_state); 

        return db;
    }; */

    public class DB(){
        
        // --------------------------- STATE ---------------------------
        public func set_inner_state(state:State) : () {
            users.set_state(state.users_state);
            invoices.set_state(state.invoices_state);
            questions.set_state(state.questions_state);
            answers.set_state(state.answers_state);
        };
        
        private var users: UsersModule.Users = UsersModule.Users();
        private var invoices: InvoicesModule.Invoices = InvoicesModule.Invoices();
        private var questions: QuestionsModule.Questions = QuestionsModule.Questions();
        private var answers: AnswersModule.Answers = AnswersModule.Answers();

        // --------------------------- DB FUNCTIONS ---------------------------
        
        // TODO: rename the func so that not both are called "create_user"
        public func create_user(id:Principal, name:Text) : Result.Result<User, Types.StateError> {
            // if user does not exist yet and is !ananymous
            if(not users.validate_key(id)){
                return #err(#UserIsInvalid);
            } else {
                return #ok(users.create_user(id, name));
            };
        }; 
        
        public func create_invoice(invoice_id:Nat, buyer_id:Principal) : Result.Result<Invoice, Types.StateError> {
            switch(users.get_user(buyer_id)){
                case(null){return #err(#UserNotFound)};
                case(?prevUser){
                    switch(Array.find<Nat>(prevUser.invoices, func (key: Nat) {return key == invoice_id;})){
                        case(?key){return #err(#InvoiceExists)};
                        case(null){
                            if(not invoices.validate_key(invoice_id)){ return #err(#InvoiceIsInvalid) } 
                            else {
                                // add invoice to invoices
                                let returnedInvoice: Invoice = invoices.create_invoice(invoice_id, buyer_id);

                                // update invoice ids on the user
                                ignore users.put_user(users.replace_invoice_ids(prevUser, invoice_id));
                                return #ok(returnedInvoice);
                            };
                        };
                    };
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
        public func create_question(user_id:Principal, invoice_id:Nat, duration_minutes:Int, title:Text, content:Text, reward:Int32) : Result.Result<Question, Types.StateError> {
            // TO DO: the switches are independent and can be refactored (readability)
            switch(invoices.get_invoice(invoice_id)){
                case(null){ return #err(#InvoiceNotFound) };
                case(?prevInvoice){
                    switch(users.get_user(user_id)){
                        case(null){ return #err(#UserNotFound) };
                        case(?prevUser){
                            // Add question to questions
                            let question: Question = questions.create_question(user_id:Principal, invoice_id:Nat, duration_minutes:Int, title:Text, content:Text, reward:Int32);
                            
                            // Add it to inoive
                            ignore invoices.put_invoice(invoices.replace_question_id(prevInvoice, question.id));

                            // Add id to the user
                            ignore users.put_user(users.replace_question_ids(prevUser, question.id));
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
        public func create_answer(user_id:Principal, question_id:Text, content:Text) : Result.Result<Answer, Types.StateError> {
            switch(users.get_user(user_id)){
                case(null){return #err(#UserNotFound)};
                case(?prevUser){
                    switch(questions.get_question(question_id)){
                        case(null){ return #err(#AnswerNotFound);};
                        case(?prevQuestion){
                            // Add answer to answers
                            let answer: Answer = answers.create_answer(user_id:Principal, question_id:Text, content:Text);
                            
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
        public func has_user_answered_question(user_id: Principal, question_id:Text): Bool {
            switch(questions.get_question(question_id)){
                case(null){false};
                case(?question){
                    let iter: Iter.Iter<Text> = Iter.fromArray(question.answers);
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
                users_state = users.get_users();
                invoices_state = invoices.get_invoices();
                questions_state = questions.get_questions();
                answers_state = answers.get_answers();
            };
        };

        // --------------------------- RE-EXPORT ---------------------------
        public let Users = object {
            public let { get_user } = users;
        };

        public let Invoices = object {
            public let { get_invoice } = invoices;
        };

        public let Questions = object {
            public let { get_question } = questions;
            public let { get_unclosed_questions } = questions;
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
        };        
    };
};