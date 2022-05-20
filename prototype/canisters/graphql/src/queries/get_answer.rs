#[macro_use]
pub mod macros{
    macro_rules! query{
        () => {
            r#"query ($answer_id:ID!){
              readAnswer (search: {id: {eq: $answer_id} } ) {
                id
                author
                creation_date
                content
              }
            }"#
        }
    }
    macro_rules! args{
        () => {
            r#"{{
              "answer_id": "{}"
            }}"#
        }
    }
    macro_rules! response{
        () => {
            "readAnswer"
        }
    }
    pub(crate) use query;
    pub(crate) use args;
    pub(crate) use response;
}