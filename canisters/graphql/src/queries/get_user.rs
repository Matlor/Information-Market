#[macro_use]
pub mod macros {
    macro_rules! query{
        () => {
            r#"query ($user_id: ID!) {
              readUser (search: {id: {eq: $user_id} } )
              {
                id
                name
                joined_date
              }
            }"#
        }
    }
    macro_rules! args{
        () => {
            r#"{{
              "user_id": "{}"
            }}"#
        }
    }
    macro_rules! response{
        () => {
            "readUser"
        }
    }
    pub(crate) use query;
    pub(crate) use args;
    pub(crate) use response;
}