const { Ed25519KeyIdentity } = require("@dfinity/identity");
const test = require("tape");
const fetch = require("node-fetch");

const { getActor } = require("./actor.cjs");

const canisterIds = require("../../../.dfx/local/canister_ids.json");
const { idlFactory } = require("../../../.dfx/local/canisters/invoice/invoice.did.test.cjs");

let Jane = Ed25519KeyIdentity.generate();

global.fetch = fetch;

const canisterId = canisterIds.invoice.local;

let invoice = null;
let creator = null;

test("invoice: assign actor()", async function (t) {
  invoice = await getActor(canisterId, idlFactory, Jane);
});

test("Invoice.create_invoice() : with correct args => ok - invoice", async function (t) {
  let args = { amount: 10000, token: { symbol: "ICP" }, permissions: [], details: [] };
  const response = await invoice.create_invoice(args);

  creator = response.ok.invoice.creator;

  t.equal(response.ok.invoice.amount, 10000n);
  t.equal(response.ok.invoice.paid, false);
});

test("Invoice.get_account_identifier() : with previous invoice creator => ok - account_identifier", async function (t) {
  const response = await invoice.get_account_identifier({ principal: creator, token: { symbol: "ICP" } });

  t.equals(response.ok.accountIdentifier.text.length, 64);
});

test("Invoice.get_balance() : with ICP token => ok - balance 0", async function (t) {
  const response = await invoice.get_balance({ token: { symbol: "ICP" } });

  t.deepEqual(response.ok, { balance: 0n });
});

test("Invoice.get_invoice() : with invalid identity => err - invalid permission", async function (t) {
  const response = await invoice.get_invoice({ id: 0 });
  t.deepEqual(response.err, {
    kind: { NotAuthorized: null },
    message: ["You do not have permission to view this invoice"]
  });
});
