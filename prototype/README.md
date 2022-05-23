## Instructions

This repo depends on the cloned and deployed repo of the invoice canister (and the ledger in there).
https://github.com/dfinity/invoice-canister

The canister id of the invoice canister is hard-coded into the project right now. To deploy:

1. First deploy the invoice canister seperately locally.
2. Then add the candid file of the invoice canister to .dfx/local/canisters/idl/<canister_id.did> of this folder.
3. Then change the canister id in main.mo to the correct id of the invoice canister.

Continue with dfx deploy.

## TO DO

Complete on how to deploy graphql canister!
Need to add documentation on graphql queries
Watchout overflow of certain types (cast amount in nat to int, maybe use string instead to store in graphql?)
Need to discuss what happens if ever graphql queries fail (think about scenarios, especially important for payments)

## Notes

Time is in minutes, because int32 in database, it shall be enough for our usage (max int32 is 2billion, current time in minutes from 1970 is 27millions)