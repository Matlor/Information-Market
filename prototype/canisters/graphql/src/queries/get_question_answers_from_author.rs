#[macro_use]
pub mod macros{
    macro_rules! query{
        () => {
            r#"query ($question_id: ID!, $author: String!) {
              readAnswer(
                search: {and: [{question: {id: {eq: $question_id}}}, {author: {eq: $author}}]}
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
              "question_id": "{}",
              "author": "{}"
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