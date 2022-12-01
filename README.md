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

## Useful References

Ledger motoko implementation: https://github.com/dfinity/ledger-ref
The invoice canister also contains some of these files: https://github.com/dfinity/invoice-canister

## Deploying Frontend

dfx deploy runs: dfx build
dfx build runs the build command in the package.json file of the project folder.
We can't make it run the command in the canister/frontend package.json
We therefore need the package.json file in the root folder to run the command to build
the frontend. And also to build the playground.
Otherwise the project won't be built again when we make changes. Deployment still works but
it just takes the old files in the dist folder. That means we need the package.json in the root
otherwise we can't make changes.
Package.json in the root runs the build commands for the frontend. You can see that by throwing
and error in the vite config.

Deploying the frontend without having deployed the other canisters can result in ugly errors.
In that case the canister ids passed through dfx and the vite config are not define then.

## Ledger folder in market

Just provides useful functions to interact with the ledger. It is used in the market directly
And in the ic-repl tests. All the files except "types" are used but types is convenient to have.

## graphql

target folder is in root only because I can't make --target-dir /canisters/grapqhl work.
I get "custom tool failed" returned.

## Candid files

Several cases:

- Canisters written in Motoko auto generates candid files (declarations)
- Motoko can't import Candid files. We need manual translation Candid -> mo
- For inter-canister calls the canisters need to know the interface of the others

Our canisters:

ledger:

- Needs no other types
- Candid is hard-coded never changes
- mo types stored in invoice folder (not needed elsewhere)

invoice:

- Needs ledger mo types
- Candid is auto-generated with dfx generate market
- mo types exist

graphql:

- Needs no other types
- Candid is auto-generated
- mo types have to be manually created from candid

market:

- Needs mo invoice && mo graphql
- Candid is auto-generated with dfx generate market
- mo types exist

frontend

- Needs did market && did ledger && did graphql

For canisters not written in Motoko we need to address two issues:

- check if we can put the candid files to the declarations folder
- manually creating the mo types (the imports don't change but the types)

It seems like dfx generate works for rust canisters now as well. So we can always use it.
So we never need candid files anywhere other than the declarations folder (and for convenience)

For the ledger the mo types stay the same we can ignore that

All in all we do two things:

- manually create the mo files for graphql
- always dfx generate

I think we can:

- ignore candid files for graphql
- delete invoice.did

ledger:

- dfx calls the ledger using the candid file specified in dfx.json
- to deploy the canister we therefore need to switch out the private and public did files.

## Tests

dfx deploy utilities

run a test:
./pick_winner.test.sh -r http://localhost:8000

## Playground

Just consist of the html file with the built js that gets imported.
Assumes a certain sudograph version to be used.
We have to manually insert into the html the canister ids of it.

## When freshly cloned

- frontend: npm i
- playground: npm i
- cargo build (to install ic-cdk-optimizer: https://i67uk-hiaaa-aaaae-qaaka-cai.raw.ic0.app/wasm-binary-optimization.html)
- ./target/bin/ic-cdk-optimizer: No such file or directory

- graphql: cargo build

- root:
  cargo build
  "cargo install ic-cdk-optimizer --root target" (installs the optimizer, I have to check how to version control it)

- TODO: Check how I can add the ic-cdk-optimizer as a dependency for the repo && what I need to commit exactly
- TODO: How can I have an empty wasm file to get rid of calling the optimizer twice

local:

- ./install-local.sh

mainnet:

- potential issue: optimizing the wasm for mainnet

## ic-repl

example how to run file:
./pick_winner.test.sh -r http://localhost:8000

ic-repl can't be run with bash
to resolve access issues: chmod u+x your_script.sh

## graphql

- anything that does not need the return values to be serialised or can do it with an external tool
- only interacts with the canister through the queries (query or update) by passing a string.
- only canisters call the functions specifically exposed that are not graphql_query or graphql_mutation
- they do so to get values in the candid format

queries folder has to be called queries

TODO: Candid does not change when the schema changes
