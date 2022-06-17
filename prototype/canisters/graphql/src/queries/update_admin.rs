#[macro_use]
pub mod macros {
    macro_rules! mutation{
        () => {
            r#"mutation ($id: ID!, $principal: String!) {
              updateAdmin(id: $id) {
                id
                principal
              }
            }"#
        }
    }
    macro_rules! args{
        () => {
            r#"{{
              "id": "{}",
              "principal": "{}"
            }}"#
        }
    }

    pub(crate) use mutation;
    pub(crate) use args;
}