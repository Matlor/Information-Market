#[macro_use]
pub mod macros{
    macro_rules! query{
        () => {
            r#"query ($question_id: ID!) {
              readAnswer(
                search: {question: {id: {eq: $question_id}}}
              ) {
                id
                author
                creation_date
                content
              }
            }
            "#
        }
    }    
    macro_rules! args{
        () => {
            r#"{{
              "question_id": "{}"
            }}"#
        }
    }
    macro_rules! response{
        () => {
            "readAnswer"
        }
    }
    pub(crate) use query;
    pub(crate) use args;
    pub(crate) use response;
}