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

// Test the original params
call market.get_coin_symbol();
assert _ == "ICP";
call market.get_min_reward();
assert _ == (1_250_000 : nat);
call market.get_fee();
assert _ == (10_000 : nat);
call market.get_duration_pick_answer();
assert _ == (1_440 : int32);
call market.get_duration_disputable();
assert _ == (2_880 : int32);

// Test that with another identity that the market initializer, updating the params fails
identity alice;
call market.update_market_params(record { min_reward_e8s = opt (1_500_000 : nat); });
assert _ == variant { err = variant { NotAllowed } };

identity default;

// Update min_reward_e8s only
call market.update_market_params(record { min_reward_e8s = opt (1_500_000 : nat); });
call market.get_min_reward();
assert _ == (1_500_000 : nat);
call market.get_fee();
assert _ == (10_000 : nat);
call market.get_duration_pick_answer();
assert _ == (1_440 : int32);
call market.get_duration_disputable();
assert _ == (2_880 : int32);

// Update transfer_fee_e8s only
call market.update_market_params(record { transfer_fee_e8s = opt (20_000 : nat); });
call market.get_min_reward();
assert _ == (1_500_000 : nat);
call market.get_fee();
assert _ == (20_000 : nat);
call market.get_duration_pick_answer();
assert _ == (1_440 : int32);
call market.get_duration_disputable();
assert _ == (2_880 : int32);

// Update pick_answer_duration_minutes only
call market.update_market_params(record { pick_answer_duration_minutes = opt (3_000 : int32); });
call market.get_min_reward();
assert _ == (1_500_000 : nat);
call market.get_fee();
assert _ == (20_000 : nat);
call market.get_duration_pick_answer();
assert _ == (3_000 : int32);
call market.get_duration_disputable();
assert _ == (2_880 : int32);

// Update disputable_duration_minutes only
call market.update_market_params(record { disputable_duration_minutes = opt (6_000 : int32); });
call market.get_min_reward();
assert _ == (1_500_000 : nat);
call market.get_fee();
assert _ == (20_000 : nat);
call market.get_duration_pick_answer();
assert _ == (3_000 : int32);
call market.get_duration_disputable();
assert _ == (6_000 : int32);

// Update all of them
call market.update_market_params(
  record {
    min_reward_e8s = opt (2_000_000 : nat);
    transfer_fee_e8s = opt (30_000 : nat);
    pick_answer_duration_minutes = opt (4_000 : int32);
    disputable_duration_minutes = opt (8_000 : int32);
  }
);
call market.get_min_reward();
assert _ == (2_000_000 : nat);
call market.get_fee();
assert _ == (30_000 : nat);
call market.get_duration_pick_answer();
assert _ == (4_000 : int32);
call market.get_duration_disputable();
assert _ == (8_000 : int32);