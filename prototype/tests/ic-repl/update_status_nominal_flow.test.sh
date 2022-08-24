#!/usr/local/bin/ic-repl

load "common/install.sh";

identity default "~/.config/dfx/identity/default/identity.pem";

// Create the utilities canister
let utilities = installUtilities();

// Install the ledger
let ledger = installLedger();

// Install the invoice canister
let invoice = installInvoice();

// Install the graphql canister
let graphql = installGraphql();

// Install the market canister
let market_arguments = record {
  invoice_canister = invoice;
  coin_symbol = "ICP";
  min_reward_e8s = (1_250_000 : nat);
  transfer_fee_e8s = (10_000 : nat);
  pick_answer_duration_minutes = (0 : int32);
  disputable_duration_minutes = (0 : int32);
  update_status_on_heartbeat = false;
};
let market = installMarket(market_arguments);
call market.get_update_status_on_heartbeat();
assert _ == false;

identity alice;
call market.create_user("alice", "");
identity bob;
call market.create_user("bob", "");
identity carlos;
call market.create_user("carlos", "");

// 0. Bob asks a question, nobody answers
identity bob;
call market.create_invoice(2_000_000);
assert _ ~= variant { ok = record { invoice = record { id = 0 : nat; } } };
call invoice.accountIdentifierToBlob(_.ok.invoice.destination);
let invoice_account = _.ok;
// Mint tokens to bob
let bob_account = call utilities.getDefaultAccountIdentifierAsBlob(bob);
identity default "~/.config/dfx/identity/default/identity.pem";
call ledger.transfer(record { 
  memo = 0 : nat64;
  amount = record { e8s = 10_000_000 : nat64 };
  fee = record { e8s = 0 : nat64 };
  to = bob_account;
  from_subaccount = null;
  created_at_time = null;
});
// Bob pays the invoice
identity bob;
call ledger.transfer(record { 
  memo = 0 : nat64;
  amount = record { e8s = 2_010_000 : nat64 };
  fee = record { e8s = 10_000 : nat64 };
  to = invoice_account;
  from_subaccount = null;
  created_at_time = null;
});
// Finally calls ask_question
call market.ask_question(0, 0, "Who was the first president of the United-States?", "");
assert _ ~= variant { ok = record { 
  status = variant { OPEN };
  reward = (20 : int32);
  title = "Who was the first president of the United-States?";
  content = "";
  author_invoice = record { id = "0" };
  open_duration = (0 : int32);
}};
let question_id = _.ok.id;
// Answers
identity alice;
call market.answer_question(question_id, "July 28, 1914");
assert _ ~= variant { ok = record { content = "July 28, 1914"; } };
let alice_answer = _.ok.id;
identity carlos;
call market.answer_question(question_id, "Summer 1914");
assert _ ~= variant { ok = record { content = "Summer 1914"; } };
let carlos_answer = _.ok.id;

// Verify that update status put the question in PICKANSWER if it has answers
call market.update_status();
call graphql.get_question(question_id);
assert _ ~= opt (record { id = question_id; status = variant {PICKANSWER} });

// Bob picks a winner
identity bob;
call market.pick_winner(question_id, alice_answer);
assert _ == variant { ok };

// Verify that update status put the question in CLOSED 
call market.update_status();
call graphql.get_question(question_id);
assert _ ~= opt (record { id = question_id; status = variant {CLOSED} });
let alice_account = call utilities.getDefaultAccountIdentifierAsBlob(alice);
call ledger.account_balance(record { account = alice_account });
// 1 one fee is deduced
assert _ ~= record { e8s = 1_990_000 : nat64 };