#[macro_use]
pub mod macros{
    macro_rules! query{
        () => {
            r#"query ($invoice_id:ID!){
              readInvoice (search: {id: {eq: $invoice_id} } ) {
                id
                buyer
              }
            }"#
        }
    }
    macro_rules! args{
        () => {
            r#"{{
              "invoice_id": "{}"
            }}"#
        }
    }
    macro_rules! response{
        () => {
            "readInvoice"
        }
    }
    pub(crate) use query;
    pub(crate) use args;
    pub(crate) use response;
}
