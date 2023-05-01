create () {
dfx identity new minter
dfx identity use minter
export MINTER_ACCOUNT=$(dfx ledger account-id)

dfx identity use default
export LEDGER_PRINCIPAL=$(dfx canister id ledger)
export MARKET_PRINCIPAL=$(dfx canister id market)
export TEST_RUNNER_ACCOUNT=$(dfx ledger account-id --of-principal $(dfx canister id test_runner))
export DEFAULT_PRINCIPAL=$(dfx identity get-principal)
export DEFAULT_ACCOUNT=$(dfx ledger account-id)

}

generate(){
dfx generate ledger
dfx generate market
dfx generate test_runner 
}

t() {
    create;
    {
    echo "yes" 
    echo "yes"
    } | {
    dfx deploy --mode reinstall test_runner --argument='(
        principal "'${MARKET_PRINCIPAL}'",
        principal "'${LEDGER_PRINCIPAL}'",
    )'}
    dfx generate test_runner
}

l() {
    create;   
    {
    echo "yes" 
    echo "yes"
    } | {
        rm canisters/ledger/ledger.did                      
        cp canisters/ledger/ledger.private.did canisters/ledger/ledger.did
        dfx deploy --mode reinstall ledger --argument '(record {
            minting_account = "'${MINTER_ACCOUNT}'";
            initial_values = vec { record { "'${TEST_RUNNER_ACCOUNT}'"; record { e8s = 10000000000000000000: nat64 } } };
            archive_options = opt record {
                trigger_threshold = 2000;
                num_blocks_to_archive = 1000;
                controller_id =  principal "'${DEFAULT_PRINCIPAL}'"
            };
            send_whitelist = vec {};
        })'
        rm canisters/ledger/ledger.did
        cp canisters/ledger/ledger.public.did canisters/ledger/ledger.did
    }
    dfx generate ledger;
}

m() {
    create;   
    {
    echo "yes" 
    echo "yes"
    } | {
        dfx deploy --mode reinstall market --argument='(record {
            ledger_canister = principal "'${LEDGER_PRINCIPAL}'";
            coin_symbol = "ICP"; 
            min_reward_e8s = 1250000; 
            transfer_fee_e8s = 10000; 
            pick_answer_duration_minutes = 2; 
            disputable_duration_minutes = 2; 
            update_status_on_heartbeat = false; 
        })';
    }
    dfx generate market;
}

t_test(){  
    t;        
    dfx canister call test_runner testQueries;
}

test(){  
    dfx canister call test_runner testQueries;
}



t_fundPlug(){
    dfx canister call test_runner fund_principal '(principal "tsm3f-vuuza-xfy3b-wcbrx-r4nzg-jy6o2-ydpbq-67lqa-rgq6j-ijkaa-aqe")'               
    dfx canister call ledger account_balance '( record { account = blob "|#92\ae\e8\f5\cam\e6\cf\9c\ce\fc-\93\f0?Iu\e9\bd\0b\dc\cf0\b7X\ff2\81\a7" } )'
}

#dfx canister call ledger transfer '( record { memo = 0; amount = record { e8s = 100_000_000_000 }; fee = record { e8s = 0 }; to = blob "|#92\ae\e8\f5\cam\e6\cf\9c\ce\fc-\93\f0?Iu\e9\bd\0b\dc\cf0\b7X\ff2\81\a7" } )'
# classic issues:
# minter is the default -> then I get "left = right"