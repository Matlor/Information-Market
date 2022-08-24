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

// Verify that update status close the question an refunds bob
call market.update_status();
call graphql.get_question(question_id);
assert _ ~= opt (record { id = question_id; status = variant {CLOSED} });
call ledger.account_balance(record { account = bob_account });
// 3 fees are deduced (to send to market subaccount, to subaccount to market main account, and to transfer out)
assert _ ~= record { e8s = 1_970_000 : nat64 }; 
