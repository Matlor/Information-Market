const { Ed25519KeyIdentity } = require("@dfinity/identity");
const test = require("tape");
const fetch = require("node-fetch");

const { getActor } = require("./actor.cjs");
const canisterIds = require("../../../.dfx/local/canister_ids.json");
const { idlFactory: marketIdlFactory } = require("../../../.dfx/local/canisters/market/market.did.test.cjs");
const { idlFactory: graphqlIdlFactory } = require("../../../.dfx/local/canisters/graphql/graphql.did.test.cjs");
const { idlFactory: invoiceIdlFactory } = require("../../../.dfx/local/canisters/invoice/invoice.did.test.cjs");

// identities
const { defaultIdentity, keeperOfCoinIdentity } = require("./identity.cjs");
let janeIdentity = Ed25519KeyIdentity.generate();

global.fetch = fetch;

const market_canister_id = canisterIds.market.local;
const graphql_canister_id = canisterIds.graphql.local;
const invoice_canister_id = canisterIds.invoice.local;

const transfer_fee = 10000n;

let janeMarketActor = null;
let defaultMarketActor = null;
let keeperOfCoinMarketActor = null;
let keeperOfCoinInvoiceActor = null;
let janeGraphqlActor = null;

let invoice_jane = null;
let invoice_default = null;
let invoice_keeper_of_coin = null;

test("Market: assign actors()", async function (t) {
  janeMarketActor = await getActor(market_canister_id, marketIdlFactory, janeIdentity);
  defaultMarketActor = await getActor(market_canister_id, marketIdlFactory, defaultIdentity);
  keeperOfCoinMarketActor = await getActor(market_canister_id, marketIdlFactory, keeperOfCoinIdentity);
  keeperOfCoinInvoiceActor = await getActor(invoice_canister_id, invoiceIdlFactory, keeperOfCoinIdentity);
  janeGraphqlActor = await getActor(graphql_canister_id, graphqlIdlFactory, janeIdentity);

  console.log("=========== Market ===========");
});

test("Market.initialize_graphql():[janeMarketActor]", async function (t) {
  const initialize_graphql_ = await janeMarketActor.initialize_graphql();

  t.equal(initialize_graphql_, true);
});

test("Market.is_graphql_initialized():[janeMarketActor]", async function (t) {
  const is_graphql_initialized_ = await janeMarketActor.is_graphql_initialized();

  t.equal(is_graphql_initialized_, true);
});

// create_invoice
test("Market.create_invoice():[janeMarketActor]: with below min reward => #err(reward below minimum)", async function (t) {
  const response = await janeMarketActor.create_invoice(10);

  t.deepEqual(response.err, { kind: { Other: null }, message: [ 'Set reward is below minimum' ] });
});

test("Market.create_invoice():[janeMarketActor]: with min reward => #ok(invoice)", async function (t) {
  const response = await janeMarketActor.create_invoice(1250001);

  invoice_jane = response.ok.invoice;

  t.equal(response.ok.invoice.amount, 1260001n);
  t.equal(response.ok.invoice.destination.text.length, 64);
});

test("Market.create_invoice():[keeperOfCoinMarketActor]: with min reward => #ok(invoice)", async function (t) {
  const response = await keeperOfCoinMarketActor.create_invoice(1250001);

  invoice_keeper_of_coin = response.ok.invoice;

  t.equal(response.ok.invoice.amount, 1260001n);
  t.equal(response.ok.invoice.destination.text.length, 64);
});

test("Market.create_invoice():[defaultMarketActor]: with min reward => #ok(invoice)", async function (t) {
  const response = await defaultMarketActor.create_invoice(1250001);

  invoice_default = response.ok.invoice;

  t.equal(response.ok.invoice.amount, 1260001n);
  t.equal(response.ok.invoice.destination.text.length, 64);
});

// ask_question
test("Market.ask_question():[janeMarketActor]: with invalid invoice id => #err(not found)", async function (t) {
  let invoice_id = 10000
  let duration_minutes =  10;
  let title = "Motoko";

  const response = await janeMarketActor.ask_question(invoice_id, duration_minutes, title, "How do you unit test in Motoko?");

  t.deepEqual(response, { err: { NotFound: null } });
});

test("Market.ask_question():[defaultMarketActor]: with identity diff from invoice creation => #err(not allowed)", async function (t) {
  let duration_minutes =  10;
  let title = "Motoko";

  const response = await defaultMarketActor.ask_question(invoice_jane.id, duration_minutes, title, "How do you unit test in Motoko?");

  t.deepEqual(response, { err: { NotAllowed: null } });
});

test("Market.ask_question():[defaultMarketActor]: with invoice NOT paid => #err(verify invoice)", async function (t) {
  let duration_minutes =  10;
  let title = "Motoko";

  const response = await defaultMarketActor.ask_question(invoice_default.id, duration_minutes, title, "How do you unit test in Motoko?");

  t.deepEqual(response, { err: { VerifyInvoiceError: null } });
});

// transfer - pay invoice
test("Invoice.transfer():[keeperOfCoinActor]: for invoice_keeper_of_coin => #ok(blockHeight)", async function (t) {
  const response = await keeperOfCoinInvoiceActor.transfer({
    amount: invoice_keeper_of_coin.amount + transfer_fee,
    token: {
      symbol: "ICP",
    },
    destination: invoice_keeper_of_coin.destination
  });

  const hasBlockHeight = response.ok.blockHeight > 1;

  t.equal(hasBlockHeight, true);
});

test("Market.ask_question():[keeperOfCoinActor]: after invoice is paid => #ok(question)", async function (t) {
  let duration_minutes =  10;
  let title = "Motoko";

  const response = await keeperOfCoinMarketActor.ask_question(invoice_keeper_of_coin.id, duration_minutes, title, "How do you unit test in Motoko?");
  const reward  = response.ok.reward;
  const content  = response.ok.content;

  t.equal(reward, 1250001);
  t.equal(content, "How do you unit test in Motoko?");
});

// answer_question
test("Market.answer_question():[defaultMarketActor]: with invalid question_id => #err(verify invoice)", async function (t) {
  let question_id = "007";
  let content = "Using motoko-matchers.";

  const response = await defaultMarketActor.answer_question(question_id, content);

  t.deepEqual(response, { err: { NotFound: null } });
});

// get_questions
test("Market.get_questions(): ", async function (t) {
  const questions = await janeGraphqlActor.get_questions();

  const hasQuestions = questions.length > 0;
  t.equal(hasQuestions, true);

  console.log("questions: ", questions);
});


// TODO:
// answer_question
// arbitrate
// pick_winner
// trigger_dispute
// update_status