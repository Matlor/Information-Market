#[macro_use]
pub mod macros {
    macro_rules! mutation{
        () => {
            r#"mutation ($user_id: ID!, $name: String!, $avatar: Blob!) {
              updateUser(input: {id: $user_id, name: $name, avatar: {replace: $avatar}}) {
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
              "user_id": "{}",
              "name": "{}",
              "avatar": "{}"
            }}"#
        }
    }
    macro_rules! response{
        () => {
            "updateUser"
        }
    }
    pub(crate) use mutation;
    pub(crate) use args;
    pub(crate) use response;
}