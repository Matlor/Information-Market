#[macro_use]
pub mod macros {
    macro_rules! mutation{
        () => {
            r#"mutation ($question_id: ID!, $author: String!, $creation_date: Int!, $content: String!) {
              createAnswer(
                input: {question: {connect: $question_id}, author: $author, creation_date: $creation_date, content: $content}
              ) {
                id
                author
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
              "author": "{}",
              "creation_date": {},
              "content": "{}"
            }}"#
        }
    }
    macro_rules! response{
        () => {
            "createAnswer"
        }
    }

    pub(crate) use mutation;
    pub(crate) use args;
    pub(crate) use response;
}