use ic_cdk_macros;
use ic_cdk::export::{candid::{CandidType}, Principal};

#[ic_cdk_macros::import(canister = "graphql")]
struct GraphQLCanister;

use serde::{Deserialize};
use serde_json::{Result, Value};

#[derive(Debug, serde::Deserialize, ic_cdk::export::candid::CandidType, Clone)]
enum QuestionStatus {
    CREATED,
    OPEN,
    PICKANSWER,
    DISPUTABLE,
    DISPUTED,
    CLOSED
}

#[derive(Debug, serde::Deserialize, ic_cdk::export::candid::CandidType, Clone)]
struct Invoice {
    id: String,
    buyer: String
}

#[derive(Debug, serde::Deserialize, ic_cdk::export::candid::CandidType, Clone)]
struct Question {
    id: String,
    author: String,
    creation_date: i32,
    creation_invoice: Invoice,
    status: QuestionStatus,
    status_update_date: i32,
    content: String,
    reward: i32,
    dispute: Option<Dispute>,
    winner: Option<Answer>,
    solution_invoice: Option<Invoice>
}

#[derive(Debug, serde::Deserialize, ic_cdk::export::candid::CandidType, Clone)]
struct Answer {
    id: String,
    author: String,
    creation_date: i32,
    content: String
}

#[derive(Debug, serde::Deserialize, ic_cdk::export::candid::CandidType, Clone)]
struct Dispute {
    id: String,
    creation_date: i32
}

/// Getter for the invoices
/// \return The list of invoices
// @todo: replace #[update] by #[query] attribute when nested queries are implemented in IC
// For now it requires the #[update] attribute, otherwise when calling this method in the
// market canister the error 'IC0504 "ic0_call_new" cannot be executed in replicated query
// mode' is returned.
// See https://forum.dfinity.org/t/call-rust-canister-error-ic0-call-new-cannot-be-executed-in-replicated-query-mode/4414
#[ic_cdk_macros::update]
async fn get_invoices() -> Vec<Invoice> {
   let query = r#"query{
        readInvoice {
            id
            buyer
        }
   }"#.to_string();
   let params = format!(r#"{{}}"#);
   let json_str = GraphQLCanister::graphql_query(
      query, params).await;
   let json_data : Value = serde_json::from_str(&json_str.0).unwrap();
   let invoices : Vec<Invoice> = serde_json::from_value(json_data["data"]["readInvoice"].clone()).unwrap();
   return invoices;
}
