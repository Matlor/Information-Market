#!/bin/bash

# TESTING #
# NOTE: update file OSX ONLY (Linux remove '')

# market
cp .dfx/local/canisters/market/market.did.js .dfx/local/canisters/market/market.did.test.cjs
sed -i '' 's/export//g' .dfx/local/canisters/market/market.did.test.cjs
echo "module.exports = { idlFactory };" >> .dfx/local/canisters/market/market.did.test.cjs