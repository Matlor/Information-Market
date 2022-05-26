const { Ed25519KeyIdentity } = require("@dfinity/identity");
const test = require("tape");
const fetch = require("node-fetch");

const { getActor } = require("./actor.cjs");

const canisterIds = require("../../../.dfx/local/canister_ids.json");
const { idlFactory } = require("../../../.dfx/local/canisters/market/market.did.test.cjs");

let Jane = Ed25519KeyIdentity.generate();
let John = Ed25519KeyIdentity.generate();

global.fetch = fetch;

const canisterId = canisterIds.market.local;

let market = null;

test("market: assign actor()", async function (t) {
  market = await getActor(canisterId, idlFactory, Jane);
});

test("market: create_invoice(10) :: should return err - reward below minimum", async function (t) {
  const response = await market.create_invoice(10);
  t.deepEqual(response.err, { kind: { Other: null }, message: [ 'Set reward is below minimum' ] });
  t.equal(typeof response.err, "object");
});

test("market: create_invoice(1250001) :: should return ok - invoice", async function (t) {
  const response = await market.create_invoice(1250001);
  console.log("response: ", response);

  t.equal(typeof response.err, "object");
});

// test("market: open_question(invoiceID, 'How do you unit test in Motoko?', 10) :: should return err - incorrect deadline", async function (t) {
//   market = await getActor(canisterId, idlFactory, Jane);

//   const invoice = await market.create_invoice(1250001);
//   let invoiceID = invoice.ok.ok.invoice.id;
//   const response = await market.ask_question(invoiceID, "How do you unit test in Motoko?", 10);

//   t.deepEqual(response.err, { IncorrectDeadline: null });
// });

// test("market: open_question(invoiceID, 'How do you unit test in Motoko?', 50) :: should return err - invoice error [insufficient balance]", async function (t) {
//   market = await getActor(canisterId, idlFactory, Jane);

//   const invoice = await market.create_invoice(1250001);
//   let invoiceID = invoice.ok.ok.invoice.id;
//   const response = await market.ask_question(invoiceID, "How do you unit test in Motoko?", 50);

//   let expected = { InvoiceError: { kind: { NotYetPaid: null }, message: ["Insufficient balance. Current Balance is 0"] } };
//   t.deepEqual(response.err, expected);
// });