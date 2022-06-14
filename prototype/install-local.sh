dfx stop
dfx start --background --clean

dfx identity new minter
dfx identity use minter
export MINT_ACC=$(dfx ledger account-id)

dfx identity use default
export LEDGER_ACC=$(dfx ledger account-id)

# Use private api for install
rm canisters/ledger/ledger.did
cp canisters/ledger/ledger.private.did canisters/ledger/ledger.did

dfx deploy ledger --argument '(record {minting_account = "'${MINT_ACC}'"; initial_values = vec { record { "'${LEDGER_ACC}'"; record { e8s=100_000_000_000 } } }; send_whitelist = vec {}})'

# Replace with public api
rm canisters/ledger/ledger.did
cp canisters/ledger/ledger.public.did canisters/ledger/ledger.did

dfx generate ledger

dfx deploy invoice
dfx generate invoice
export INVOICE_PRINCIPAL=$(dfx canister id invoice)

dfx deploy graphql
dfx generate graphql

dfx deploy market --argument='(record {invoice_canister = principal "'${INVOICE_PRINCIPAL}'"; coin_symbol = "ICP"; min_reward_e8s = 1250000; transfer_fee_e8s = 10000; pick_answer_duration_minutes = 1440; disputable_duration_minutes = 2880; update_status_on_heartbeat = true; })'
dfx generate market

# For some reason, even if the build stage seems to do the same thing if you call 'dfx build frontend'
# or 'dfx build playground' (see package.json), creating both canister, calling build once, and then
# installing both canisters does not work. Use deploy instead.
#dfx canister create frontend
#dfx canister create playground
#dfx build frontend
#dfx canister install frontend
#dfx canister install playground

dfx deploy frontend

dfx deploy playground

# Mint 1 million ICPs to give to the market canister to be able to run the dummy scenario
#dfx canister id market
#dfx canister call invoice get_account_identifier '(record {"principal" = principal "[THE_ID]"; token = record {symbol = "ICP"}})'
#dfx canister call invoice accountIdentifierToBlob '(variant {text = "[THE_ACCOUNT]"})'
#dfx identity use minter
#dfx canister call ledger transfer '( record { memo = 0; amount = record { e8s = 100_000_000_000_000 }; fee = record { e8s = 0 }; to = blob "[THE_BLOB]" } )'
#dfx canister call ledger account_balance '( record { account = blob "[THE_BLOB]" } )'

# To transfer ICPs with the invoice canister
#dfx canister call invoice get_account_identifier '(record {"principal" = principal "qo4hi-ppoyh-z654d-z42t7-h64jp-cedg5-h53dv-ztaor-sln5m-byuzk-oae"; token = record {symbol = "ICP"}})'
#dfx canister call invoice transfer '(record {destination = variant {"principal" = principal "qo4hi-ppoyh-z654d-z42t7-h64jp-cedg5-h53dv-ztaor-sln5m-byuzk-oae"}; token = record {symbol = "ICP"}; amount = 150000;})'