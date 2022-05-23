#[macro_use]
pub mod macros{
    macro_rules! query{
        () => {
            r#"query ($invoice_id: ID!) {
              readQuestion(
                search: {author_invoice: {id: {eq: $invoice_id}}}
              ) {
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
            }
            "#
        }
    }    
    macro_rules! args{
        () => {
            r#"{{
              "invoice_id": "{}"
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