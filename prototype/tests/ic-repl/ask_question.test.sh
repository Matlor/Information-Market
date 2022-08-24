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
  update_status_on_heartbeat = true;
};
let market = installMarket(market_arguments);

// 1. Asking a question referring an invoice that does not exist shall fail
identity alice;
call market.ask_question(0, 60, "Who was the first man on the moon?", "");
assert _ == variant { err = variant { NotFound } };

// 2. Asking a question referring an invoice from another user shall fail
identity bob;
call market.create_user("bob", "bob_avatar");
assert _ ~= variant { ok = record { name = "bob"; } };
call market.create_invoice(2_000_000);
assert _ ~= variant { ok = record { invoice = record { id = 0 : nat; } } };
call invoice.accountIdentifierToBlob(_.ok.invoice.destination);
let invoice_account = _.ok;
identity alice;
call market.ask_question(0, 60, "Who was the first man on the moon?", "");
assert _ == variant { err = variant { NotAllowed } };

// 3. Asking a question with an unpaid invoice shall fail
identity bob;
call market.ask_question(0, 120, "Who was the first president of the United-States?", "");
assert _ ~= variant { err = variant { VerifyInvoiceError = record { kind = variant { NotYetPaid }; } } };

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

// Bob pays half the invoice
identity bob;
call ledger.transfer(record { 
  memo = 0 : nat64;
  amount = record { e8s = 1_010_000 : nat64 };
  fee = record { e8s = 10_000 : nat64 };
  to = invoice_account;
  from_subaccount = null;
  created_at_time = null;
});

// 4. Asking a question refering an invoice half paid should not work
call market.ask_question(0, 120, "Who was the first president of the United-States?", "");
assert _ ~= variant { err = variant { VerifyInvoiceError = record { kind = variant { NotYetPaid }; } } };

// Bob pays the rest of the invoice
identity bob;
call ledger.transfer(record { 
  memo = 0 : nat64;
  amount = record { e8s = 1_000_000 : nat64 };
  fee = record { e8s = 10_000 : nat64 };
  to = invoice_account;
  from_subaccount = null;
  created_at_time = null;
});

// 5. Asking a question with a fully paid invoice shall work!
call market.ask_question(0, 120, "Who was the first president of the United-States?", "");
assert _ ~= variant { ok = record { 
  status = variant { OPEN };
  reward = (20 : int32);
  title = "Who was the first president of the United-States?";
  content = "";
  author_invoice = record { id = "0" };
  open_duration = (120 : int32);
}};
let question_id = _.ok.id;

// 6. Asking a question referring the same invoice shall fail
call market.ask_question(0, 120, "When did the first world war begin?", "");
assert _ == variant { err = variant { NotAllowed } };


