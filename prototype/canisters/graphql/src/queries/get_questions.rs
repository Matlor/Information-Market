#[macro_use]
pub mod macros{
    macro_rules! query{
        () => {
            r#"query {
              readQuestion {
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
            r#"{{}}"#
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