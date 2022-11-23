#[macro_use]
pub mod macros {
    macro_rules! mutation{
        () => {
            r#"mutation ($principal: String!) {
              createAdmin(input: {principal: $principal}) {
                id
                principal
              }
            }"#
        }
    }
    macro_rules! args{
        () => {
            r#"{{
              "principal": "{}"
            }}"#
        }
    }

    pub(crate) use mutation;
    pub(crate) use args;
}