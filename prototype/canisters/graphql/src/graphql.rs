mod queries {
    pub mod close_question;
    pub mod create_admin;
    pub mod create_answer;
    pub mod create_invoice;
    pub mod create_question;
    pub mod get_admin;
    pub mod get_answer;
    pub mod get_invoice;
    pub mod get_question_answers;
    pub mod get_question_answers_from_author;
    pub mod get_question_by_invoice;
    pub mod get_question;
    pub mod get_questions;
    pub mod must_pick_answer;
    pub mod open_dispute;
    pub mod pick_winner;
    pub mod solve_dispute;
    pub mod update_admin;
}

use sudograph::graphql_database;

graphql_database!("canisters/graphql/src/schema.graphql");

#[derive(ic_cdk::export::candid::CandidType, serde::Deserialize, Debug, Clone)]
enum QuestionStatusEnum {
    OPEN,
    PICKANSWER,
    DISPUTABLE,
    DISPUTED,
    CLOSED
}

#[derive(ic_cdk::export::candid::CandidType, serde::Deserialize, Debug, Clone)]
struct AdminType {
    id: String,
    principal: String
}

#[derive(ic_cdk::export::candid::CandidType, serde::Deserialize, Debug, Clone)]
struct InvoiceType {
    id: String,
    buyer: String
}

#[derive(ic_cdk::export::candid::CandidType, serde::Deserialize, Debug, Clone)]
struct QuestionType {
    id: String,
    author: String,
    author_invoice: InvoiceType,
    creation_date: i32,
    status: QuestionStatusEnum,
    status_update_date: i32,
    status_end_date: i32,
    open_duration: i32,
    title: String,
    content: String,
    reward: i32,
    winner: Option<AnswerType>,
    close_transaction_block_height: Option<String>
}

#[derive(ic_cdk::export::candid::CandidType, serde::Deserialize, Debug, Clone)]
struct AnswerType {
    id: String,
    author: String,
    creation_date: i32,
    content: String
}

impl std::fmt::Display for QuestionStatusEnum {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
       match *self {
            QuestionStatusEnum::OPEN => write!(f, "OPEN"),
            QuestionStatusEnum::PICKANSWER => write!(f, "PICKANSWER"),
            QuestionStatusEnum::DISPUTABLE => write!(f, "DISPUTABLE"),
            QuestionStatusEnum::DISPUTED => write!(f, "DISPUTED"),
            QuestionStatusEnum::CLOSED => write!(f, "CLOSED"),
       }
    }
}

#[update]
async fn set_admin(principal: ic_cdk::export::Principal) -> () {
    match get_admin().await {
        Some(admin) => {
            if ic_cdk::export::Principal::to_text(&ic_cdk::caller()) != admin.principal {
                panic!("Not authorized: only the admin can change the admin");
            } else {
                graphql_mutation(
                    queries::update_admin::macros::mutation!().to_string(),
                    format!(queries::update_admin::macros::args!(), admin.id, ic_cdk::export::Principal::to_text(&principal))).await;
            }
        },
        None => {
            graphql_mutation(
                queries::create_admin::macros::mutation!().to_string(),
                format!(queries::create_admin::macros::args!(), ic_cdk::export::Principal::to_text(&principal))).await;
        }
    }
}

#[query]
async fn get_admin() -> Option<AdminType> {
    let json_str = graphql_query(
        queries::get_admin::macros::query!().to_string(),
        format!(queries::get_admin::macros::args!())).await;
    let json_data : serde_json::Value = serde_json::from_str(&json_str).unwrap();
    let json_response = json_data["data"][queries::get_admin::macros::response!()].as_array();
    if json_response != None {
        let vec_values = json_response.unwrap();
        if vec_values.len() == 1 {
            return Some(serde_json::from_value(vec_values[0].clone()).unwrap());
        }
    }
    return None;
}

async fn check_admin() -> () {
    let mut authorized : bool = false;
    match get_admin().await {
        Some(admin) => authorized = ic_cdk::export::Principal::to_text(&ic_cdk::caller()) == admin.principal,
        None => authorized = true,
    }
    if !authorized {
        panic!("Not authorized: only the admin can perform updates on the graphql canister")
    }
}

#[update]
async fn create_invoice(id: String, buyer: String) -> Option<InvoiceType> {
    check_admin().await;
    let json_str = graphql_mutation(
        queries::create_invoice::macros::mutation!().to_string(),
        format!(
            queries::create_invoice::macros::args!(),
            id,
            buyer)).await;
    let json_data : serde_json::Value = serde_json::from_str(&json_str).unwrap();
    let json_response = json_data["data"][queries::create_invoice::macros::response!()].as_array();
    if json_response != None {
        let vec_values = json_response.unwrap();
        if vec_values.len() == 1 {
            return Some(serde_json::from_value(vec_values[0].clone()).unwrap());
        }
    }
    return None;
}

#[update]
async fn create_question(
    author: String, 
    invoice_id: String, 
    creation_date: i32,
    status_end_date: i32,
    open_duration: i32,
    title: String,
    content: String, 
    reward: i32) -> Option<QuestionType> {
    check_admin().await;
    let json_str = graphql_mutation(
        queries::create_question::macros::mutation!().to_string(),
        format!(
            queries::create_question::macros::args!(),
            author,
            invoice_id,
            creation_date,
            status_end_date,
            open_duration,
            title,
            content,
            reward)).await;
    let json_data : serde_json::Value = serde_json::from_str(&json_str).unwrap();
    let json_response = json_data["data"][queries::create_question::macros::response!()].as_array();
    if json_response != None {
        let vec_values = json_response.unwrap();
        if vec_values.len() == 1 {
            return Some(serde_json::from_value(vec_values[0].clone()).unwrap());
        }
    }
    return None;
}

#[update]
async fn create_answer(
    question_id: String,
    author: String,
    creation_date: i32,
    content: String) -> Option<AnswerType> {
    check_admin().await;
    let json_str = graphql_mutation(
        queries::create_answer::macros::mutation!().to_string(),
        format!(
            queries::create_answer::macros::args!(), 
            question_id,
            author,
            creation_date,
            content)).await;
    let json_data : serde_json::Value = serde_json::from_str(&json_str).unwrap();
    let json_response = json_data["data"][queries::create_answer::macros::response!()].as_array();
    if json_response != None {
        let vec_values = json_response.unwrap();
        if vec_values.len() == 1 {
            return Some(serde_json::from_value(vec_values[0].clone()).unwrap());
        }
    }
    return None;
}

#[update]
async fn must_pick_answer(question_id: String, status_update_date: i32, status_end_date: i32) -> bool {
    check_admin().await;
    let json_str = graphql_mutation(
        queries::must_pick_answer::macros::mutation!().to_string(),
        format!(
            queries::must_pick_answer::macros::args!(),
            question_id,
            status_update_date,
            status_end_date)).await;
    let json_data : serde_json::Value = serde_json::from_str(&json_str).unwrap();
    let json_response = json_data["data"][queries::must_pick_answer::macros::response!()].as_array();
    if json_response != None {
        let vec_values = json_response.unwrap();
        if vec_values.len() == 1 {
            let question : QuestionType = serde_json::from_value(vec_values[0].clone()).unwrap();
            return question.status_update_date == status_update_date;
        }
    }
    return false;
}

#[update]
async fn open_dispute(question_id: String, status_update_date: i32) -> bool {
    check_admin().await;
    let json_str = graphql_mutation(
        queries::open_dispute::macros::mutation!().to_string(),
        format!(
            queries::open_dispute::macros::args!(),
            question_id,
            status_update_date)).await;
    let json_data : serde_json::Value = serde_json::from_str(&json_str).unwrap();
    let json_response = json_data["data"][queries::open_dispute::macros::response!()].as_array();
    if json_response != None {
        let vec_values = json_response.unwrap();
        if vec_values.len() == 1 {
            let question : QuestionType = serde_json::from_value(vec_values[0].clone()).unwrap();
            return question.status_update_date == status_update_date;
        }
    }
    return false;
}

#[update]
async fn solve_dispute(
    question_id: String,
    answer_id: String,
    close_transaction_block_height: String,
    status_update_date: i32) -> bool {
    check_admin().await;
    let json_str = graphql_mutation(
        queries::solve_dispute::macros::mutation!().to_string(),
        format!(
            queries::solve_dispute::macros::args!(),
            question_id,
            answer_id,
            close_transaction_block_height,
            status_update_date)).await;
    let json_data : serde_json::Value = serde_json::from_str(&json_str).unwrap();
    let json_response = json_data["data"][queries::solve_dispute::macros::response!()].as_array();
    if json_response != None {
        let vec_values = json_response.unwrap();
        if vec_values.len() == 1 {
            let question : QuestionType = serde_json::from_value(vec_values[0].clone()).unwrap();
            return question.status_update_date == status_update_date;
        }
    }
    return false;
}

#[update]
async fn pick_winner(question_id: String, answer_id: String, status_update_date: i32, status_end_date: i32) -> bool {
    check_admin().await;
    let json_str = graphql_mutation(
        queries::pick_winner::macros::mutation!().to_string(),
        format!(
            queries::pick_winner::macros::args!(),
            question_id,
            answer_id,
            status_update_date,
            status_end_date)).await;
    let json_data : serde_json::Value = serde_json::from_str(&json_str).unwrap();
    let json_response = json_data["data"][queries::pick_winner::macros::response!()].as_array();
    if json_response != None {
        let vec_values = json_response.unwrap();
        if vec_values.len() == 1 {
            let question : QuestionType = serde_json::from_value(vec_values[0].clone()).unwrap();
            return question.status_update_date == status_update_date;
        }
    }
    return false;
}

#[update]
async fn close_question(
    question_id: String,
    close_transaction_block_height: String,
    status_update_date: i32) -> bool {
    check_admin().await;
    let json_str = graphql_mutation(
        queries::close_question::macros::mutation!().to_string(),
        format!(
            queries::close_question::macros::args!(),
            question_id,
            close_transaction_block_height,
            status_update_date)).await;
    let json_data : serde_json::Value = serde_json::from_str(&json_str).unwrap();
    let json_response = json_data["data"][queries::close_question::macros::response!()].as_array();
    if json_response != None {
        let vec_values = json_response.unwrap();
        if vec_values.len() == 1 {
            let question : QuestionType = serde_json::from_value(vec_values[0].clone()).unwrap();
            return question.status_update_date == status_update_date;
        }
    }
    return false;
}

#[query]
async fn get_invoice(invoice_id: String) -> Option<InvoiceType> {
    let json_str = graphql_query(
        queries::get_invoice::macros::query!().to_string(),
        format!(queries::get_invoice::macros::args!(), invoice_id)).await;
    let json_data : serde_json::Value = serde_json::from_str(&json_str).unwrap();
    let json_response = json_data["data"][queries::get_invoice::macros::response!()].as_array();
    if json_response != None {
        let vec_values = json_response.unwrap();
        if vec_values.len() == 1 {
            return Some(serde_json::from_value(vec_values[0].clone()).unwrap());
        }
    }
    return None;
}

#[query]
async fn get_question(question_id: String) -> Option<QuestionType> {
    let json_str = graphql_query(
        queries::get_question::macros::query!().to_string(),
        format!(queries::get_question::macros::args!(), question_id)).await;
    let json_data : serde_json::Value = serde_json::from_str(&json_str).unwrap();
    let json_response = json_data["data"][queries::get_question::macros::response!()].as_array();
    if json_response != None {
        let vec_values = json_response.unwrap();
        if vec_values.len() == 1 {
            return Some(serde_json::from_value(vec_values[0].clone()).unwrap());
        }
    }
    return None;
}

#[query]
async fn get_question_by_invoice(invoice_id: String) -> Option<QuestionType> {
    let json_str = graphql_query(
        queries::get_question_by_invoice::macros::query!().to_string(),
        format!(queries::get_question_by_invoice::macros::args!(), invoice_id)).await;
    let json_data : serde_json::Value = serde_json::from_str(&json_str).unwrap();
    let json_response = json_data["data"][queries::get_question_by_invoice::macros::response!()].as_array();
    if json_response != None {
        let vec_values = json_response.unwrap();
        if vec_values.len() == 1 {
            return Some(serde_json::from_value(vec_values[0].clone()).unwrap());
        }
    }
    return None;
}

#[query]
async fn get_questions() -> Vec<QuestionType> {
    let json_str = graphql_query(
        queries::get_questions::macros::query!().to_string(),
        format!(queries::get_questions::macros::args!())).await;
    let json_data : serde_json::Value = serde_json::from_str(&json_str).unwrap();
    let json_response = json_data["data"][queries::get_questions::macros::response!()].as_array();
    if json_response != None {
        return serde_json::from_value(serde_json::Value::Array(json_response.unwrap().clone())).unwrap();
    }
    return Vec::<QuestionType>::new();
}

#[query]
async fn get_answer(question_id: String, answer_id: String) -> Option<AnswerType> {
    let json_str = graphql_query(
        queries::get_answer::macros::query!().to_string(),
        format!(queries::get_answer::macros::args!(), question_id, answer_id)).await;
    let json_data : serde_json::Value = serde_json::from_str(&json_str).unwrap();
    let json_response = json_data["data"][queries::get_answer::macros::response!()].as_array();
    if json_response != None {
        let vec_values = json_response.unwrap();
        if vec_values.len() == 1 {
            return Some(serde_json::from_value(vec_values[0].clone()).unwrap());
        }
    }
    return None;
}

#[query]
async fn has_answered(question_id: String, author: String) -> bool {
    let json_str = graphql_query(
        queries::get_question_answers_from_author::macros::query!().to_string(),
        format!(queries::get_question_answers_from_author::macros::args!(), question_id, author)).await;
    let json_data : serde_json::Value = serde_json::from_str(&json_str).unwrap();
    let json_response = json_data["data"][queries::get_question_answers_from_author::macros::response!()].as_array();
    return json_response != None && json_response.unwrap().len() != 0;
}

#[query]
async fn has_answers(question_id: String) -> bool {
    let json_str = graphql_query(
        queries::get_question_answers::macros::query!().to_string(),
        format!(queries::get_question_answers::macros::args!(), question_id)).await;
    let json_data : serde_json::Value = serde_json::from_str(&json_str).unwrap();
    let json_response = json_data["data"][queries::get_question_answers::macros::response!()].as_array();
    return json_response != None && json_response.unwrap().len() != 0;
}
