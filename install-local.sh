# Assume dfx is already running

dfx canister create --all
dfx build
dfx canister install graphql
dfx canister install playground
dfx canister install market --argument='("ICP", 1250000, 4320, 1440, 2880)'