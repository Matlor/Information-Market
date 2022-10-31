#[macro_use]
pub mod macros {
    macro_rules! mutation{
        () => {
            r#"mutation ($author_id: ID!, $invoice_id: ID!, $creation_date: Int!, $status_end_date: Int!, $open_duration: Int!, $title: String!, $content: String!, $reward: Int!) {
              createQuestion(
                input: {author: {connect: $author_id}, author_invoice: {connect: $invoice_id}, creation_date: $creation_date, status: 0, status_update_date: $creation_date, status_end_date: $status_end_date, open_duration: $open_duration, title: $title, content: $content, reward: $reward}
              ) {
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
              "author_id": "{}",
              "invoice_id": "{}",
              "creation_date": {},
              "status_end_date": {},
              "open_duration": {},
              "title": "{}",
              "content": "{}",
              "reward": {}
            }}"#
        }
    }
    macro_rules! response{
        () => {
            "createQuestion"
        }
    }
    pub(crate) use mutation;
    pub(crate) use args;
    pub(crate) use response;
}