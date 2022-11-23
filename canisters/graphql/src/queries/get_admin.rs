#[macro_use]
pub mod macros{
    macro_rules! query{
        () => {
            r#"query {
                readAdmin {
                  id
                  principal
                }
              }
            "#
        }
    }
    macro_rules! args{
        () => {
          r#"{{}}"#
        }
    }
    macro_rules! response{
        () => {
          "readAdmin"
        }
    }
    pub(crate) use query;
    pub(crate) use args;
    pub(crate) use response;
}