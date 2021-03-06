#[macro_use]
pub mod macros {
    macro_rules! mutation{
        () => {
            r#"mutation ($user_id: ID!, $name: String!, $joined_date: Int!, $avatar: Blob!) {
              createUser(
                input: {id: $user_id, name: $name, joined_date: $joined_date, avatar: $avatar}
              ) {
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
              "joined_date": {},
              "avatar": "{}"
            }}"#
        }
    }
    macro_rules! response{
        () => {
            "createUser"
        }
    }
    pub(crate) use mutation;
    pub(crate) use args;
    pub(crate) use response;
}