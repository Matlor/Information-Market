#[macro_use]
pub mod macros{
    macro_rules! mutation{
        () => {
            r#"mutation ($question_id: ID!, $creation_date: Int!) {
              createDispute(input: {question: {connect: $question_id}, creation_date: $creation_date}) {
                id
                creation_date
              }
            }"#
        }
    }
    macro_rules! args{
        () => {
            r#"{{
              "question_id": "{}",
              "creation_date": {}
            }}"#
        }
    }
    macro_rules! response{
        () => {
            "createDispute"
        }
    }
    pub(crate) use mutation;
    pub(crate) use args;
    pub(crate) use response;
}