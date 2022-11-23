#[macro_use]
pub mod macros {
    macro_rules! mutation{
        () => {
            r#"mutation ($id: ID!, $buyer_id: ID!) {
              createInvoice(input: {id: $id, buyer: {connect: $buyer_id}}) {
                id
                buyer {
                  id
                  name
                  joined_date
                }
              }
            }"#
        }
    }
    macro_rules! args{
        () => {
            r#"{{
              "id": "{}",
              "buyer_id": "{}"
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