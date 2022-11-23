module { 

    public type QuestionStatusEnum =  {
        #OPEN;
        #PICKANSWER;
        #DISPUTABLE;
        #DISPUTED;
        #CLOSED;
    };

    public type AdminType =  {
        id: Text;
        principal: Text;
    };

    public type UserType = {
        id: Text;
        name: Text;
        joined_date: Int32;
    };

    public type InvoiceType = {
        id: Text;
        buyer: UserType;
    };

    public type QuestionType = {
        id: Text;
        author: UserType;
        author_invoice: InvoiceType;
        creation_date: Int32;
        status: QuestionStatusEnum;
        status_update_date: Int32;
        status_end_date: Int32;
        open_duration: Int32;
        title: Text;
        content: Text;
        reward: Int32;
        winner: ?AnswerType;
        close_transaction_block_height: ?Text;
    };

    public type AnswerType = {
        id: Text;
        author: UserType;
        creation_date: Int32;
        content: Text;
    };

    public type Interface = actor {
        graphql_query: (Text, Text) -> async (Text);
        graphql_mutation: (Text, Text) -> async (Text);
        close_question: (Text, Text, Int32) -> async (Bool);
        create_answer: (Text, Text, Int32, Text) -> async (?AnswerType);
        create_invoice: (Text, Text) -> async (?InvoiceType);
        create_question: (Text, Text, Int32, Int32, Int32, Text, Text, Int32) ->async (?QuestionType);
        create_user: (Text, Text, Int32) ->async (?UserType);
        get_admin: query () -> async(?AdminType);
        get_answer: query (Text, Text) -> async(?AnswerType) ;
        get_invoice: query (Text) -> async(?InvoiceType) ;
        get_question_by_invoice:query (Text) -> async(?QuestionType) ;
        get_question: query(Text) -> async(?QuestionType) ;
        get_questions: query() -> async([QuestionType]) ;
        get_user:query (Text) -> async(?UserType) ;
        has_answered: query(Text, Text) ->async (Bool) ;
        has_answers: query(Text) -> async(Bool) ;
        must_pick_answer: (Text, Int32, Int32) ->async (Bool);
        open_dispute: (Text, Int32) ->async (Bool);
        pick_winner: (Text, Text, Int32, Int32) -> async(Bool);
        set_admin: (Principal) -> async();
        solve_dispute: (Text, Text, Text, Int32) ->async (Bool);
        update_user: (Text, Text, ?Text) -> async(?UserType);
    };


}