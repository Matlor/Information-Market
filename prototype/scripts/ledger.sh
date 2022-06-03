#!/bin/bash
echo ${LEDGER_ACC}
echo ${MINT_ACC}
ledger_account_vec=$(node ./scripts/hex_to_bytes.js ${LEDGER_ACC})
mint_account_vec=$(node ./scripts/hex_to_bytes.js ${MINT_ACC})

dfx canister call ledger account_balance '(record { account = vec{ '$ledger_account_vec'} })'
dfx canister call ledger account_balance '(record { account = vec{ '$mint_account_vec'} })'