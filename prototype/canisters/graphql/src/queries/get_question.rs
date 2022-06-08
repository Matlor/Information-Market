#[macro_use]
pub mod macros{
    macro_rules! query{
        () => {
            r#"query ($question_id:ID!){
              readQuestion (search: {id: {eq: $question_id} } ) {
                id
                author
                author_invoice {
                  id
                  buyer
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
              "question_id": "{}"
            }}"#
        }
    }
    macro_rules! response{
        () => {
            "readQuestion"
        }
    }
    pub(crate) use query;
    pub(crate) use args;
    pub(crate) use response;
}