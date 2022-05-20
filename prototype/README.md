## Instructions

This repo depends on the cloned and deployed repo of the invoice canister (and the ledger in there).
https://github.com/dfinity/invoice-canister

## Instructions to Get Started

1. First deploy the invoice canister seperately locally.
2. Then add the candid file of the invoice canister to .dfx/local/canisters/idl/<canister_id.did> of this folder.
3. Then change the canister id in main.mo to the correct id of the invoice canister.
4. Run `npm install`
5. Comment out all `Frontend` field in dfx.json
6. Run `dfx generate`
7. Uncomment out all `Frontend` field in dfx.json
8. Run `dfx generate`
9. Run `dfx deploy`

