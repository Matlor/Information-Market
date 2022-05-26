#[macro_use]
pub mod macros {
    macro_rules! mutation{
        () => {
            r#"mutation ($id: ID!, $buyer: String!) {
              createInvoice(input: {id: $id, buyer: $buyer}) {
                id
                buyer
              }
            }"#
        }
    }
    macro_rules! args{
        () => {
            r#"{{
              "id": "{}",
              "buyer": "{}"
            }}"#
        }
    }
    macro_rules! response{
        () => {
            "createInvoice"
        }
    }
    pub(crate) use mutation;
    pub(crate) use args;
    pub(crate) use response;
}