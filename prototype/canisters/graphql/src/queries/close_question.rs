#[macro_use]
pub mod macros{
    macro_rules! mutation{
        () => {
            r#"mutation ($question_id: ID!, $close_transaction_block_height: String!, $status_update_date: Int!) {
              updateQuestion(input: {id: $question_id, close_transaction_block_height: $close_transaction_block_height, status_update_date: $status_update_date, status: CLOSED}) {
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
                winner {
                  id
                  author
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
              "close_transaction_block_height": "{}",
              "status_update_date": {}
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