#[macro_use]
pub mod macros{
    macro_rules! mutation{
        () => {
            r#"mutation ($question_id: ID!, $status_update_date: Int!, $status_end_date: Int!) {
              updateQuestion(input: {id: $question_id, status_update_date: $status_update_date, status_end_date: $status_end_date, status: 1}) {
                id
                author {
                  id
                  name
                  joined_date
                }
                author_invoice {
                  id
                  buyer {
                    id
                    name
                    joined_date
                  }
                }
                creation_date
                status
                status_update_date
                status_end_date
                open_duration
                title
                content
                reward
                winner {
                  id
                  author {
                    id
                    name
                    joined_date
                  }
                  creation_date
                  content
                }
                close_transaction_block_height
              }
            }"#
        }
    }
    macro_rules! args{
        () => {
            r#"{{
              "question_id": "{}",
              "status_update_date": {},
              "status_end_date": {}
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