#[macro_use]
pub mod macros{
    macro_rules! mutation{
        () => {
            r#"mutation ($question_id: ID!, $status: QuestionStatus!, $status_update_date: Int!) {
              updateQuestion(input: {id: $question_id, status: $status, status_update_date: $status_update_date}) {
                id
                author
                author_invoice {
                  id
                  buyer
                }
                creation_date
                status
                status_update_date
                content
                reward
                dispute {
                  id
                  creation_date
                }
                winner {
                  id
                  author
                  creation_date
                  content
                }
                winner_invoice {
                  id
                  buyer
                }
              }
            }"#
        }
    }
    macro_rules! args{
        () => {
            r#"{{
              "question_id": "{}",
              "status": "{}"
              "status_update_date": "{}"
            }}"#
        }
    }
    macro_rules! response{
        () => {
            "updateQuestion"
        }
    }
    pub(crate) use mutation;
    pub(crate) use args;
    pub(crate) use response;
}