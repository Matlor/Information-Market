export LEDGER_PRINCIPAL=$(dfx canister id ledger)
export INVOICE_PRINCIPAL=$(dfx canister id invoice)
export MARKET_PRINCIPAL=$(dfx canister id market)
export TEST_RUNNER_ACCOUNT=$(dfx ledger account-id --of-principal $(dfx canister id test_runner))

t() {
    {
    echo "yes" 
    echo "yes"
    } | {
    dfx deploy --mode reinstall test_runner --argument='(
        principal "'${MARKET_PRINCIPAL}'",
        principal "'${LEDGER_PRINCIPAL}'",
        principal "'${INVOICE_PRINCIPAL}'"
    )'}
}

l() {
    {
    echo "yes" 
    echo "yes"
    } | {
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
    }
}

m() {
    {
    echo "yes" 
    echo "yes"
    } | {
        dfx deploy --mode reinstall market --argument='(record {
            invoice_canister = principal "'${INVOICE_PRINCIPAL}'"; 
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