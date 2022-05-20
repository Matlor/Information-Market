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