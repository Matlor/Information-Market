# IMPORTANT: YOU NEED TO SET THE exportGeneratedMutationFunction TO false BEFORE
# ACTUALLY DEPLOYING THE GRAPHQL CANISTER AND THEN CALL THE FOLLOWING set_admin
# COMMAND TO FULLY PREVENT EXECUTION OF GRAPHQL MUTATIONS FROM OTHER SOURCES THAN
# THE MARKET CANISTER

# NOTE: 
# if --with-cycles is not specified, default of 4tn cycles will be used. Use less to conduct experiments.

# 1. Get wallet
export WALLET_PRINCIPAL=$(dfx identity --network ic get-wallet)

# 2. Do NOT deploy the ledger canister

# 3. Deploy the invoice canister. "ryjl3-tyaaa-aaaaa-aaaba-cai" is the hard-coded mainnet ledger canister id.
dfx deploy --network ic --wallet "$WALLET_PRINCIPAL" invoice --argument='(principal "ryjl3-tyaaa-aaaaa-aaaba-cai")' --with-cycles 1000000000000
dfx generate invoice
export INVOICE_PRINCIPAL=$(dfx canister id invoice)


# 4. Deploy the graphql canister
dfx canister --network ic --wallet "$WALLET_PRINCIPAL" create --with-cycles 1000000000000 graphql
# NOTE: To deploy to mainnet the graphql wasm needs to be optimised for size as indicated in the sudograph docs (Wasm binary optimization)
# This command needs to be run that replaces the wasm file with an optimised file. 
# This assumes we have installed the optimizer: cargo install ic-cdk-optimizer --root target
# Running these commands twice is the simplest solution when the graphql-optimized file does not exist yet.
# The first build will run into an error that can be ignored.
# TODO: Understand how to create an empty "graphql-optimized.wasm" file instead
dfx build graphql
./target/bin/ic-cdk-optimizer ./target/wasm32-unknown-unknown/release/graphql.wasm -o ./target/wasm32-unknown-unknown/release/graphql-optimized.wasm
dfx build graphql
./target/bin/ic-cdk-optimizer ./target/wasm32-unknown-unknown/release/graphql.wasm -o ./target/wasm32-unknown-unknown/release/graphql-optimized.wasm

dfx canister --network ic --wallet "$WALLET_PRINCIPAL" install --mode upgrade graphql
dfx generate graphql


# 5. Deploy the market canister
export INVOICE_PRINCIPAL=$(dfx canister --network ic id invoice)
export GRAPHQL_PRINCIPAL=$(dfx canister --network ic id graphql)
dfx deploy --network ic --wallet "$WALLET_PRINCIPAL" market --argument='(record {invoice_canister = principal "'${INVOICE_PRINCIPAL}'"; graphql_canister = principal "'${GRAPHQL_PRINCIPAL}'"; coin_symbol = "ICP"; min_reward_e8s = 1250000; transfer_fee_e8s = 10000; pick_answer_duration_minutes = 1440; disputable_duration_minutes = 2880; update_status_on_heartbeat = true; })'  --with-cycles 1000000000000
dfx generate market

# 6. Set the admin of the graphql canister
export MARKET_PRINCIPAL=$(dfx canister --network ic id market)
dfx canister --network ic call graphql set_admin '(principal "'${MARKET_PRINCIPAL}'")'

# 7. Deploy the frontend canister
dfx deploy --network ic --wallet "$WALLET_PRINCIPAL" frontend --with-cycles 1000000000000


# ------------------------ PREPARATION ------------------------

# CREATE A WALLET

# 1. Choose Identity:
#    dfx identity use <IDENTITY OF YOUR CHOICE>
#    export IDENTITY_PRINCIPAL=$(dfx identity --network ic get-principal)

# 2. Get your account
#    dfx ledger --network ic account-id

# 3. Send ICP bought somewhere to the accountId

# 4. Check you balance
#    dfx ledger --network ic balance  

# 5. Create a canister id for the wallet canister and exchange ICP to cycles:
#    dfx ledger --network ic create-canister "$IDENTITY_PRINCIPAL" --amount <ICP AMOUNT>
#    Should return: "Created canister with id: <WALLET_ID>"

# 6. Deploy the cycles wallet canister:
#    dfx identity --network ic deploy-wallet <WALLET_ID>

# 7. Get the wallets canister id:
#    export WALLET_PRINCIPAL=$(dfx identity --network ic get-wallet)  

# 8. Check balance of cycles (2 equivalent options)
#    dfx wallet --network ic balance
#    dfx canister --network ic call "$WALLET_PRINCIPAL" wallet_balance 


# TOP UP WALLET

# 1. Get your wallet principal:
#    export WALLET_PRINCIPAL=$(dfx identity --network ic get-wallet)  
 export WALLET_PRINCIPAL=$(dfx identity --network ic get-wallet) 


# 2. Exchange ICP to cycles:
#    dfx ledger --network ic top-up "$WALLET_PRINCIPAL" --amount 0.5
 

# ADD CYCLES TO EXISTING CANISTERS

# 1. Get your wallet principal:
#    export WALLET_PRINCIPAL=$(dfx identity --network ic get-wallet)  

# 2. Add cycles to the canister:
#    dfx canister --network ic --wallet "$WALLET_PRINCIPAL" deposit-cycles 1000000000000 <CANISTER_NAME>

# MINNET CANDID UI
# https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.ic0.app/  