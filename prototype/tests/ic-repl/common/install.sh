#!/usr/local/bin/ic-repl

function install(wasm, args, cycle) {
  identity default;
  let id = call ic.provisional_create_canister_with_cycles(record { settings = null; amount = opt (cycle : nat) });
  let S = id.canister_id;
  call ic.install_code(
    record {
      arg = args;
      wasm_module = wasm;
      mode = variant { install };
      canister_id = S;
    }
  );
  S
};

// Import ledger from hard-coded principal because it seems to be 
// the only way to make it work when a canister is imported via
// "import Canister "canister:name"" in the motoko code (see invoice ICPLedger.mo)
function installLedger() {
  import ledger = "rrkah-fqaaa-aaaaa-aaaaq-cai";
  ledger;
};

// Import graphql from hard-coded principal because it seems to be 
// the only way to make it work when a canister is imported via
// "import Canister "canister:name"" in the motoko code (see markets main.mo)
function installGraphql(){
  import graphql = "rkp4c-7iaaa-aaaaa-aaaca-cai";
  graphql;
};


function installInvoice(arguments){
  import interface = "2vxsx-fae" as "../../canisters/invoice/invoice.did";
  let args = encode interface.__init_args(arguments);
  let wasm = file("../../.dfx/local/canisters/invoice/invoice.wasm");
  install(wasm, args, 0);
};

function installMarket(arguments){
  import interface = "2vxsx-fae" as "../../.dfx/local/canisters/market/market.did";
  let args = encode interface.__init_args(arguments);
  let wasm = file("../../.dfx/local/canisters/market/market.wasm");
  install(wasm, args, 0);
};

function installUtilities(){
  import interface = "2vxsx-fae" as "../../.dfx/local/canisters/utilities/utilities.did";
  let args = encode interface.__init_args();
  let wasm = file("../../.dfx/local/canisters/utilities/utilities.wasm");
  install(wasm, args, 0);
};