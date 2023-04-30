

# 1. Get wallet
export WALLET_PRINCIPAL=$(dfx identity --network ic get-wallet)

dfx canister --network ic --wallet "$WALLET_PRINCIPAL" create market --with-cycles 0
dfx canister --network ic --wallet "$WALLET_PRINCIPAL" create frontend --with-cycles 0
dfx canister --network ic --wallet "$WALLET_PRINCIPAL" create test_runner --with-cycles 0

export LEDGER_PRINCIPAL=$(dfx canister --network ic  id ledger)
export MARKET_PRINCIPAL=$(dfx canister --network ic id market)
export TEST_RUNNER_ACCOUNT=$(dfx ledger account-id --of-principal $(dfx canister --network ic id test_runner))

# cycles:500000000000

dfx deploy --mode reinstall --network ic --wallet "$WALLET_PRINCIPAL" market --argument='(record {
    ledger_canister = principal "'${LEDGER_PRINCIPAL}'";
    coin_symbol = "ICP"; 
    min_reward_e8s = 1250000; 
    transfer_fee_e8s = 10000; 
    pick_answer_duration_minutes = 2; 
    disputable_duration_minutes = 2; 
    update_status_on_heartbeat = false; 
})' --with-cycles 500000000000


dfx deploy --network ic --wallet "$WALLET_PRINCIPAL" test_runner --argument='(
    principal "'${MARKET_PRINCIPAL}'", 
    principal "'${LEDGER_PRINCIPAL}'",
)' --with-cycles 0

dfx generate ledger
dfx generate market
dfx generate test_runner 

dfx deploy --network ic --wallet "$WALLET_PRINCIPAL" frontend --argument='(principal "ryjl3-tyaaa-aaaaa-aaaba-cai")' --with-cycles 0


# ------------------------ PREPARATION ------------------------
# NOTE: 
# if --with-cycles is not specified, default of 4tn cycles will be used. Use less to conduct experiments.

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

# 2. Exchange ICP to cycles:
#    dfx ledger --network ic top-up "$WALLET_PRINCIPAL" --amount 0.5
 

# ADD CYCLES TO EXISTING CANISTERS

# 1. Get your wallet principal:
#    export WALLET_PRINCIPAL=$(dfx identity --network ic get-wallet)  

# 2. Add cycles to the canister:
#    dfx canister --network ic --wallet "$WALLET_PRINCIPAL" deposit-cycles 1000000000000 <CANISTER_NAME>

# MINNET CANDID UI
# https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.ic0.app/  


# CHECKING CYCLE BALANCE

# dfx canister --network ic --wallet "$WALLET_PRINCIPAL" status <CANISTER NAME> 