#!/usr/local/bin/ic-repl

load "common/install.sh";

identity default;

// Create the utilities canister
let utilities = installUtilities();

// Install the ledger
let ledger = installLedger();

// Install the invoice canister
let invoice = installInvoice(ledger);

// Install the graphql canister
let graphql = installGraphql();

// Install the market canister
let market_arguments = record {
  invoice_canister = invoice;
  graphql_canister = graphql;
  coin_symbol = "ICP";
  min_reward_e8s = (1_250_000 : nat);
  transfer_fee_e8s = (10_000 : nat);
  pick_answer_duration_minutes = (1_440 : nat);
  disputable_duration_minutes = (2_880 : nat);
  update_status_on_heartbeat = (false : bool);
};
let market = installMarket(market_arguments);

identity alice;

// Create alice user
call market.create_user("alice", "alice_avatar");
assert _ ~= variant { ok = record { name = "alice"; } };

// Try to create it another time, it shall return an error
call market.create_user("alice", "alice_avatar");
assert _ == variant { err = variant { UserExists } };

identity bob;

// Create user with username alice from another principal is working though
call market.create_user("alice", "alice_avatar");
assert _ ~= variant { ok = record { name = "alice"; } };

// Updating user shall work if the user exists
call market.update_user("bob", opt "bob_avatar");
assert _ ~= variant { ok = record { name = "bob"; } };

identity carlos;

// Updating user if the user does not exist shall fail
call market.update_user("carlos", opt "carlos_avatar");
assert _ == variant { err = variant { UserNotFound } };

