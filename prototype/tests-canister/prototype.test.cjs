const { Ed25519KeyIdentity } = require("@dfinity/identity");
const test = require("tape");
const fetch = require("node-fetch");

const { getActor } = require("./actor.cjs");

const canisterIds = require("../.dfx/local/canister_ids.json");
const { idlFactory } = require("../.dfx/local/canisters/Prototype/Prototype.did.test.cjs");

let Jane = Ed25519KeyIdentity.generate();
let John = Ed25519KeyIdentity.generate();

global.fetch = fetch;

const canisterId = canisterIds.Prototype.local;

let prototype = null;

test("Prototype: version()", async function (t) {
  prototype = await getActor(canisterId, idlFactory, Jane);

  const response = await prototype.version();

  console.log("version: ", response);
  t.equal(typeof response, "string");
});

test("Prototype: obtain_invoice(10) :: should return err - reward below minimum", async function (t) {
  prototype = await getActor(canisterId, idlFactory, Jane);

  const response = await prototype.obtain_invoice(10);

  t.deepEqual(response.err, "Reward is below minium");
  t.equal(typeof response.err, "string");
});

test("Prototype: obtain_invoice(1250001) :: should return ok - invoice", async function (t) {
  prototype = await getActor(canisterId, idlFactory, Jane);

  const response = await prototype.obtain_invoice(1250001);

  t.equal(typeof response.ok.ok.invoice.id, "bigint");
});

test("Prototype: open_question(invoiceID, 'How do you unit test in Motoko?', 10) :: should return err - incorrect deadline", async function (t) {
  prototype = await getActor(canisterId, idlFactory, Jane);

  const invoice = await prototype.obtain_invoice(1250001);
  let invoiceID = invoice.ok.ok.invoice.id;
  const response = await prototype.open_question(invoiceID, "How do you unit test in Motoko?", 10);

  t.deepEqual(response.err, { IncorrectDeadline: null });
});

test("Prototype: open_question(invoiceID, 'How do you unit test in Motoko?', 50) :: should return err - invoice error [insufficient balance]", async function (t) {
  prototype = await getActor(canisterId, idlFactory, Jane);

  const invoice = await prototype.obtain_invoice(1250001);
  let invoiceID = invoice.ok.ok.invoice.id;
  const response = await prototype.open_question(invoiceID, "How do you unit test in Motoko?", 50);

  let expected = { InvoiceError: { kind: { NotYetPaid: null }, message: ["Insufficient balance. Current Balance is 0"] } };
  t.deepEqual(response.err, expected);
});
