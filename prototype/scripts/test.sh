#!/bin/bash

# TESTING #
# NOTE: update file OSX ONLY (Linux remove '')

# Prototype
cp .dfx/local/canisters/Prototype/Prototype.did.js .dfx/local/canisters/Prototype/Prototype.did.test.cjs
sed -i '' 's/export//g' .dfx/local/canisters/Prototype/Prototype.did.test.cjs
echo "module.exports = { idlFactory };" >> .dfx/local/canisters/Prototype/Prototype.did.test.cjs
