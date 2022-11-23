#[macro_use]
pub mod macros{
    macro_rules! query{
        () => {
            r#"query ($question_id: ID!, $author_id: ID!) {
              readAnswer(
                search: {and: [{question: {id: {eq: $question_id}}}, {author: {id: {eq: $author_id}}}]}
              ) {
                id
                author {
                  id
                  name
                  joined_date
                }
                creation_date
                content
              }
            }"#
        }
    }    
    macro_rules! args{
        () => {
            r#"{{
              "question_id": "{}",
              "author_id": "{}"
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