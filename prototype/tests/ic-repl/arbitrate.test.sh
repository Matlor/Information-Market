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
  pick_answer_duration_minutes = (1_440 : int32);
  disputable_duration_minutes = (2_880 : int32);
};
let market = installMarket(market_arguments);

identity alice;
call market.create_user("alice", "");
identity bob;
call market.create_user("bob", "");
identity carlos;
call market.create_user("carlos", "");

// 0. Bob asks a question, alice and carlos answers, bob picks alice as winner, carlos opens a dispute
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
// Update the question status to PICKANSWER
identity default;
call graphql.must_pick_answer(question_id, (0: int32), (0 : int32));
assert _ == true;
// Bob picks alice answer
identity bob;
call market.pick_winner(question_id, alice_answer);
assert _ == variant { ok };

// 1. Arbitrating a question shall fail if not the initializer of the canister
identity carlos;
call market.arbitrate(question_id, alice_answer);
assert _ == variant { err = variant { NotAllowed } };

// 2. Arbitrating a question that does not exist shall fail
identity default;
call market.arbitrate("fake question", "fake answer");
assert _ == variant { err = variant { NotFound } };

// 3. Arbitrating a question before a dispute has been triggered shall fail
identity default;
call market.arbitrate(question_id, alice_answer);
assert _ == variant { err = variant { WrongStatus } };

// Carlos triggers a dispute
identity carlos;
call market.trigger_dispute(question_id);
assert _ == variant { ok };

// 4. Arbitrating a question with an answer that does not exist shall fail
identity default;
call market.arbitrate(question_id, "fake answer");
assert _ == variant { err = variant { NotFound } };

// 5. Arbitrating the question shall finally work
identity default;
call market.arbitrate(question_id, alice_answer);
assert _ == variant { ok };
call graphql.get_question(question_id);
assert _ ~= opt (record { id = question_id; status = variant {CLOSED} });

// Verify the balance of alice account
let alice_account = call utilities.getDefaultAccountIdentifierAsBlob(alice);
call ledger.account_balance(record { account = alice_account });
// 1 one fee is deduced
assert _ ~= record { e8s = 1_990_000 : nat64 };