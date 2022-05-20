#[macro_use]
pub mod macros{
    macro_rules! query{
        () => {
            r#"query {
              readAnswer {
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
            r#"{{}}"#
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