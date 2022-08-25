dfx stop
dfx start --background --clean

# 1. Deploy the ledger canister
# Create a minting identity
dfx identity new minter
dfx identity use minter
export MINT_ACC=$(dfx ledger account-id)
# Switch back to default identity
dfx identity use default
rm canisters/ledger/ledger.did
cp canisters/ledger/ledger.private.did canisters/ledger/ledger.did
dfx deploy ledger --argument '(record {minting_account = "'${MINT_ACC}'"; initial_values = vec {}; send_whitelist = vec {}})'
rm canisters/ledger/ledger.did
cp canisters/ledger/ledger.public.did canisters/ledger/ledger.did
dfx generate ledger

# 2. Deploy the invoice canister
dfx deploy invoice
dfx generate invoice

# 3. Deploy the graphql canister
dfx deploy graphql
dfx generate graphql

# 4. Deploy the market canister
export INVOICE_PRINCIPAL=$(dfx canister id invoice)
dfx deploy market --argument='(record {invoice_canister = principal "'${INVOICE_PRINCIPAL}'"; coin_symbol = "ICP"; min_reward_e8s = 1250000; transfer_fee_e8s = 10000; pick_answer_duration_minutes = 1440; disputable_duration_minutes = 2880; })'
dfx generate market

# 5. Deploy the frontend canister
dfx deploy frontend

# 6. (dev-only) Deploy the playground canister
dfx deploy playground

# ------------------------- FOR PRODUCTION ENVIRONMENT -------------------------

# IMPORTANT: YOU NEED TO SET THE exportGeneratedMutationFunction TO false BEFORE
# ACTUALLY DEPLOYING THE GRAPHQL CANISTER AND THEN CALL THE FOLLOWING set_admin
# COMMAND TO FULLY PREVENT EXECUTION OF GRAPHQL MUTATIONS FROM OTHER SOURCES THAN
# THE MARKET CANISTER

#export MARKET_PRINCIPAL=$(dfx canister id market)
#dfx canister call graphql set_admin '(principal "'${MARKET_PRINCIPAL}'")'

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