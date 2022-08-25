#!/usr/local/bin/ic-repl

load "common/install.sh";

identity default;

// Create the utilities canister
let utilities = installUtilities();

// Install the ledger
let ledger = installLedger(default, utilities, 0);

// Install the invoice canister
let invoice = installInvoice();

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

// Creating an invoice with a reward less than the minimum shall return an error
call market.create_invoice(1_000_000);
assert _ == variant { err = record { kind = variant { Other }; message = opt ("Set reward is below minimum"); } };

// Creating an invoice with an unknown user shall return an error
call market.create_invoice(2_000_000);
assert _ == variant { err = record { kind = variant { Other }; message = opt ("Unknown user"); } };

// Create alice user
call market.create_user("alice", "alice_avatar");
assert _ ~= variant { ok = record { name = "alice"; } };

// Finally check it works
call market.create_invoice(2_000_000);
assert _ ~= variant { 
  ok = record { 
    invoice = record {
      id = 0 : nat;
      creator = market;
      paid = false;
      amountPaid = 0 : nat;
      amount = 2_010_000 : nat;
    };
  }
};
