#!/bin/bash

# TESTING #
# NOTE: update file OSX ONLY (Linux remove '')

# graphql
cp .dfx/local/canisters/graphql/graphql.did.js .dfx/local/canisters/graphql/graphql.did.test.cjs
sed -i '' 's/export//g' .dfx/local/canisters/graphql/graphql.did.test.cjs
echo "module.exports = { idlFactory };" >> .dfx/local/canisters/graphql/graphql.did.test.cjs

# market
cp .dfx/local/canisters/market/market.did.js .dfx/local/canisters/market/market.did.test.cjs
sed -i '' 's/export//g' .dfx/local/canisters/market/market.did.test.cjs
echo "module.exports = { idlFactory };" >> .dfx/local/canisters/market/market.did.test.cjs

# invoice
cp .dfx/local/canisters/invoice/invoice.did.js .dfx/local/canisters/invoice/invoice.did.test.cjs
sed -i '' 's/export//g' .dfx/local/canisters/invoice/invoice.did.test.cjs
echo "module.exports = { idlFactory };" >> .dfx/local/canisters/invoice/invoice.did.test.cjs