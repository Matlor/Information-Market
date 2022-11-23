#[macro_use]
pub mod macros {
    macro_rules! mutation{
        () => {
            r#"mutation ($question_id: ID!, $author_id: ID!, $creation_date: Int!, $content: String!) {
              createAnswer(
                input: {question: {connect: $question_id}, author: {connect: $author_id}, creation_date: $creation_date, content: $content}
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
              "author_id": "{}",
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