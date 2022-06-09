dfx stop
dfx start --background --clean

dfx identity new minter
dfx identity use minter
export MINT_ACC=$(dfx ledger account-id)

dfx identity use default
export LEDGER_ACC=$(dfx ledger account-id)
export TEST_ACC="cd60093cef12e11d7b8e791448023348103855f682041e93f7d0be451f48118b"

# Use private api for install
rm canisters/ledger/ledger.did
cp canisters/ledger/ledger.private.did canisters/ledger/ledger.did

dfx deploy ledger --argument '(record {minting_account = "'${MINT_ACC}'"; initial_values = vec { record { "'${LEDGER_ACC}'"; record { e8s=100_000_000_000 } }; record { "'${TEST_ACC}'"; record { e8s=100_000_000_000 } }; }; send_whitelist = vec {}})'

# Replace with public api
rm canisters/ledger/ledger.did
cp canisters/ledger/ledger.public.did canisters/ledger/ledger.did

dfx generate ledger

dfx deploy invoice
dfx generate invoice
export INVOICE_PRINCIPAL=$(dfx canister id invoice)

dfx deploy graphql
dfx generate graphql

dfx deploy market --argument='("'${INVOICE_PRINCIPAL}'", "ICP", 1250000, 10000, 1440, 2880, 1000, true)'
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
