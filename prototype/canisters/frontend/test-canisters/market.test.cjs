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

  const initialize_graphql_ = await market.initialize_graphql();
  const is_graphql_initialized_ = await market.is_graphql_initialized();

  t.equal(initialize_graphql_, true);
  t.equal(is_graphql_initialized_, true);
});

test("Market.create_invoice() : with below min reward => err - reward below minimum", async function (t) {
  const response = await market.create_invoice(10);
  t.deepEqual(response.err, { kind: { Other: null }, message: [ 'Set reward is below minimum' ] });
  t.equal(typeof response.err, "object");
});

test("Market.create_invoice() : with min reward => ok - invoice", async function (t) {
  const expected = {
    ok: {
      invoice: {
        id: 0n,
        amount: 1260001n
      }
    }
  };

  const response = await market.create_invoice(1250001);

  t.equal(response.ok.invoice.amount, expected.ok.invoice.amount);
  t.equal(typeof response.ok, "object");
});

test("Market.ask_question() : with invalid invoice id => err - not found", async function (t) {
  let invoice_id = 100

  const response = await market.ask_question(invoice_id, "How do you unit test in Motoko?");

  t.deepEqual(response, { err: { NotFound: null } });
});

test("Market.ask_question() : with identity diff from invoice creation => err - not allowed", async function (t) {
  const invoice_ = await market.create_invoice(1250001);
  let invoice_id = invoice_.ok.invoice.id;

  market = await getActor(canisterId, idlFactory, John);

  const response = await market.ask_question(invoice_id, "How do you unit test in Motoko?");

  t.deepEqual(response, { err: { NotAllowed: null } });
});

test("Market.ask_question() : with invoice NOT paid => err - verify invoice", async function (t) {
  const invoice_ = await market.create_invoice(1250001);
  let invoice_id = invoice_.ok.invoice.id;

  const response = await market.ask_question(invoice_id, "How do you unit test in Motoko?");

  t.deepEqual(response, { err: { VerifyInvoiceError: null } });
});

test("Market.answer_question() : with invalid question_id => err - verify invoice", async function (t) {
  const response = await market.answer_question("007", "Using motoko-matchers.");

  t.deepEqual(response, { err: { NotFound: null } });
});
