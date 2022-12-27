dfx stop
dfx start --background --clean

dfx identity new minter
dfx identity use minter
export MINTER_ACCOUNT=$(dfx ledger account-id)

dfx identity use default
export DEFAULT_PRINCIPAL=$(dfx identity get-principal)
export DEFAULT_ACCOUNT=$(dfx ledger account-id)

dfx canister create ledger
dfx canister create invoice
dfx canister create market
dfx canister create frontend
dfx canister create test_runner

export LEDGER_PRINCIPAL=$(dfx canister id ledger)
export INVOICE_PRINCIPAL=$(dfx canister id invoice)
export MARKET_PRINCIPAL=$(dfx canister id market)
export TEST_RUNNER_ACCOUNT=$(dfx ledger account-id --of-principal $(dfx canister id test_runner))

rm canisters/ledger/ledger.did
cp canisters/ledger/ledger.private.did canisters/ledger/ledger.did
dfx deploy --mode reinstall ledger --argument '(record {
    minting_account = "'${MINTER_ACCOUNT}'"; 
    initial_values = vec { record { "'${TEST_RUNNER_ACCOUNT}'"; record { e8s = 18446744073709551615: nat64 } } }; 
    archive_options = opt record { 
        trigger_threshold = 2000; 
        num_blocks_to_archive = 1000; 
        controller_id =  principal "'${DEFAULT_PRINCIPAL}'" 
    };
    send_whitelist = vec {}; 
})'
rm canisters/ledger/ledger.did
cp canisters/ledger/ledger.public.did canisters/ledger/ledger.did

dfx deploy invoice --argument='(principal "'${LEDGER_PRINCIPAL}'")'
dfx deploy --mode reinstall market --argument='(record {
    invoice_canister = principal "'${INVOICE_PRINCIPAL}'"; 
    coin_symbol = "ICP"; 
    min_reward_e8s = 1250000; 
    transfer_fee_e8s = 10000; 
    pick_answer_duration_minutes = 2; 
    disputable_duration_minutes = 2; 
    update_status_on_heartbeat = false; 
})'
dfx deploy frontend

dfx deploy --mode reinstall test_runner --argument='(
    principal "'${MARKET_PRINCIPAL}'", 
    principal "'${LEDGER_PRINCIPAL}'",
    principal "'${INVOICE_PRINCIPAL}'"
)'

dfx generate ledger
dfx generate invoice
dfx generate market
dfx generate test_runner 
# ------------------------- FOR PRODUCTION ENVIRONMENT -------------------------


#export MARKET_PRINCIPAL=$(dfx canister id market)

# You will also need to remove the call to loadScenario in App.tsx before actually
# deploying the canisters


# ---------------- TO RUN THE DUMMY SCENARIO IN DEV ENVIRONMENT ----------------

# First go to the deployed frontend canister in your web browser, this will trigger
# the loadScenario function. Once the logs say 'Loading scenario finished!', you'll
# need to transfer some funds to the market canister and your user

# 1. To transfer 1mil ICPs to the market canister to be able to run the dummy scenario
#dfx canister id market
#dfx canister call invoice get_account_identifier '(record {"principal" = principal "[MARKET_ID]"; token = record {symbol = "ICP"}})'
#dfx canister call invoice accountIdentifierToBlob '(variant {text = "[MARKET_ACCOUNT]"})'
#dfx identity use minter
#dfx canister call ledger transfer '( record { memo = 0; amount = record { e8s = 100_000_000_000_000 }; fee = record { e8s = 0 }; to = blob "[MARKET_BLOB]" } )'
#dfx canister call ledger account_balance '( record { account = blob "[MARKET_BLOB]" } )'

# 2. To transfer thousand ICPs to the user connected through plug
#dfx ledger account-id --of-principal "[USER_PRINCIPAL]"
#dfx canister call invoice accountIdentifierToBlob '(variant {text = "[USER_ACCOUNT_ID]"})'
#dfx identity use minter
#dfx canister call ledger transfer '( record { memo = 0; amount = record { e8s = 100_000_000_000 }; fee = record { e8s = 0 }; to = blob "[USER_BLOB]" } )'
#dfx canister call ledger account_balance '( record { account = blob "[USER_BLOB]" } )'


# test runner: 
# d245503f277e7f83fc326f1bfb7538c50b8dee8311be8c06437b9cd621afb365
# \d2EP?\27~\7f\83\fc2o\1b\fbu8\c5\0b\8d\ee\83\11\be\8c\06C{\9c\d6!\af\b3e


# market:
# r7inp-6aaaa-aaaaa-aaabq-cai
# 1b26e99d9381624c6a21e0e4d21f9461f0b533b055f3fe36b0eeb97841d7a230
# \1b&\e9\9d\93\81bLj!\e0\e4\d2\1f\94a\f0\b53\b0U\f3\fe6\b0\ee\b9xA\d7\a20
# \1B\26\E9\9D\93\81\62\4C\6A\21\E0\E4\D2\1F\94\61\F0\B5\33\B0\55\F3\FE\36\B0\EE\B9\78\41\D7\A2\30