## Instructions

This repo depends on the cloned and deployed repo of the invoice canister (and the ledger in there).
https://github.com/dfinity/invoice-canister

## Instructions to Get Started

1. First deploy the invoice canister seperately locally.
2. Then add the candid file of the invoice canister to .dfx/local/canisters/idl/<canister_id.did> of this folder.
3. Then change the canister id in main.mo to the correct id of the invoice canister.
4. Run `npm install`
5. Comment out all `Frontend & Playground` field in dfx.json
6. Run `dfx generate`
7. Uncomment out all `Frontend & Playground` field in dfx.json
8. Run `dfx generate`
9. Run `dfx deploy`

## Testing

## TO DO

Complete on how to deploy graphql canister!
First mutation shall be a "graphql_mutation": (text, text)
Need to add documentation on graphql queries
Watchout overflow of certain types (cast amount in nat to int, maybe use string instead to store in graphql?)
Need to discuss what happens if ever graphql queries fail (think about scenarios, especially important for payments)

## Notes

Time is in minutes, because int32 in database, it shall be enough for our usage (max int32 is 2billion, current time in minutes from 1970 is 27millions)