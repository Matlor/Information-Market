
# IMPORTANT: YOU HAVE TO UPDATE THE HARDCODED LEDGER AND GRAPHQL CANISTER ID IN tests/ic-repl/common/install.sh FOR THE TESTS TO WORK!
# Rational: the ledger and graphql canisters are imported via the import directive the motoko source code
# This means they shall be deployed for the canisters that use them (resp the invoice and market canisters)
# and be hard-coded in tests/ic-repl/common/install.sh.
# The other canisters are just created and built: this allows to install before running each tests and avoid
# having hard-coded link for them in tests/ic-repl/common/install.sh

dfx stop
dfx start --background --clean

# 1. Deploy the ledger canister, use default identity for minting: this allows
# to mint from ic-repl, because the default identity is stored uncrypted
# contrary to other identities
dfx identity use default
export DEFAULT_ACCOUNT=$(dfx ledger account-id)
rm canisters/ledger/ledger.did
cp canisters/ledger/ledger.private.did canisters/ledger/ledger.did
dfx deploy ledger --argument '(record {minting_account = "'${DEFAULT_ACCOUNT}'"; initial_values = vec {}; send_whitelist = vec {}})' --mode=reinstall
rm canisters/ledger/ledger.did
cp canisters/ledger/ledger.public.did canisters/ledger/ledger.did
dfx generate ledger


# 2. Create and build the invoice canister
dfx canister create invoice
dfx build invoice 

# 3. Deploy the graphql canister
dfx deploy graphql --mode=reinstall

# 4. Create and build the market canister
dfx canister create market
dfx build market

# 5. Create and build the test utilites canister
dfx canister create utilities
dfx build utilities
