## Instructions

This repo depends on the cloned and deployed repo of the invoice canister (and the ledger in there).
https://github.com/dfinity/invoice-canister

The canister id of the invoice canister is hard-coded into the project right now. To deploy:

1. First deploy the invoice canister seperately locally.
2. Then add the candid file of the invoice canister to .dfx/local/canisters/idl/<canister_id.did> of this folder.
3. Then change the canister id in main.mo to the correct id of the invoice canister.

Continue with dfx deploy.

## Testing
` npm run test`

## Types

GraphQL does not have a Nat or BigInt type, it only supports Int32. For this reason:
 - the time is stored in minutes
 - the ICPs are stored in e3s (0.001 ICP and 2 million ICPs are respectively the minimum and maximum possible values)
