const { Ed25519KeyIdentity } = require("@dfinity/identity");
const test = require("tape");

const { getActor } = require("./actor.cjs");
const { idlFactory } = require("../../../.dfx/local/canisters/invoice/invoice.did.test.cjs");
const canisterIds = require("../../../.dfx/local/canister_ids.json");

// identities
const { defaultIdentity, keeperOfCoinIdentity } = require("./identity.cjs");
let janeIdentity = Ed25519KeyIdentity.generate();

const invoice_canister_id = canisterIds.invoice.local;
const transfer_fee = 10000n;

let janeActor = null;
let defaultActor = null;
let keeperOfCoinActor = null;

let invoice_default = null;
let invoice_jane = null;
let invoice_keeper_of_coin = null;

test("Invoice: assign actors()", async function (t) {
  janeActor = await getActor(invoice_canister_id, idlFactory, janeIdentity);
  defaultActor = await getActor(invoice_canister_id, idlFactory, defaultIdentity);
  keeperOfCoinActor = await getActor(invoice_canister_id, idlFactory, keeperOfCoinIdentity);

  console.log("=========== Invoice ===========");
});

// create_invoice
test("Invoice.create_invoice():[defaultActor]: with amount: 10000n => #ok(invoice)", async function (t) {
  let args = { amount: 10000n, token: { symbol: "ICP" }, permissions: [], details: [] };
  const response = await defaultActor.create_invoice(args);

  invoice_default = response.ok.invoice;

  t.equal(response.ok.invoice.amount, 10000n);
  t.equal(response.ok.invoice.paid, false);
});

test("Invoice.create_invoice():[janeActor]: with amount: 10000n => #ok(invoice)", async function (t) {
  let args = { amount: 10000n, token: { symbol: "ICP" }, permissions: [], details: [] };
  const response = await janeActor.create_invoice(args);

  invoice_jane = response.ok.invoice;

  t.equal(response.ok.invoice.amount, 10000n);
  t.equal(response.ok.invoice.paid, false);
});

test("Invoice.create_invoice():[keeperOfCoinActor]: with permissions[janeIdentity, defaultIdentity] => #ok(invoice)", async function (t) {
  let args = {
    amount: 10000n,
    token: { symbol: "ICP" },
    permissions: [
      {
        canGet: [defaultIdentity.getPrincipal(), janeIdentity.getPrincipal()],
        canVerify: [defaultIdentity.getPrincipal()]
      }
    ],
    details: []
  };

  const response = await keeperOfCoinActor.create_invoice(args);

  invoice_keeper_of_coin = response.ok.invoice;

  t.equal(response.ok.invoice.amount, 10000n);
  t.equal(response.ok.invoice.paid, false);
});

// get_account_identifier
test("Invoice.get_account_identifier():[defaultActor]: for invoice_default.creator => #ok(account_identifier)", async function (t) {
  const response = await defaultActor.get_account_identifier({ principal: invoice_default.creator, token: { symbol: "ICP" } });

  t.equals(response.ok.accountIdentifier.text.length, 64);
});

test("Invoice.get_account_identifier():[janeActor]: for invoice_jane.creator => #ok(account_identifier)", async function (t) {
  const response = await janeActor.get_account_identifier({ principal: invoice_jane.creator, token: { symbol: "ICP" } });

  t.equals(response.ok.accountIdentifier.text.length, 64);
});

test("Invoice.get_account_identifier():[janeActor]: for invoice_default.creator => #ok(account_identifier)", async function (t) {
  const response = await janeActor.get_account_identifier({ principal: invoice_default.creator, token: { symbol: "ICP" } });

  t.equals(response.ok.accountIdentifier.text.length, 64);
});

// get_balance
test("Invoice.get_balance():[defaultActor]: for ICP token => #ok(balance=0)", async function (t) {
  const response = await defaultActor.get_balance({ token: { symbol: "ICP" } });

  t.deepEqual(response.ok, { balance: 0n });
});

test("Invoice.get_balance():[keeperOfCoinActor]: for ICP token => #ok(balance=100_000_000_000)", async function (t) {
  const response = await keeperOfCoinActor.get_balance({ token: { symbol: "ICP" } });
  const hasBalance = response.ok.balance > 10;

  t.equal(hasBalance, true);
});

// get_invoice
test("Invoice.get_invoice():[defaultActor]: for invoice_jane.id, different from creator => #err(invalid permission)", async function (t) {
  const response = await defaultActor.get_invoice({ id: invoice_jane.id });

  t.deepEqual(response.err, {
    kind: { NotAuthorized: null },
    message: ["You do not have permission to view this invoice"]
  });
});

test("Invoice.get_invoice():[defaultActor]: for invoice_default.id, same as creator => #ok(invoice)", async function (t) {
  const response = await defaultActor.get_invoice({ id: invoice_default.id });

  t.equal(response.ok.invoice.amount, 10000n);
  t.equal(response.ok.invoice.paid, false);
});

test("Invoice.get_invoice():[defaultActor]: with authorized identities for invoice_keeper_of_coin  => #ok(invoice)", async function (t) {
  const response = await defaultActor.get_invoice({ id: invoice_keeper_of_coin.id });

  t.equal(response.ok.invoice.amount, 10000n);
  t.equal(response.ok.invoice.paid, false);
});

// verify_invoice
test("Invoice.verify_invoice():[defaultActor]: for invoice_jane.id, different from creator => #err(invalid permission)", async function (t) {
  const response = await defaultActor.verify_invoice({ id: invoice_jane.id });

  t.deepEqual(response.err, { kind: { NotAuthorized: null }, message: ["You do not have permission to verify this invoice"] });
});

test("Invoice.verify_invoice():[defaultActor]: for invoice_default.id, same as creator => #err(insufficient balance)", async function (t) {
  const response = await defaultActor.verify_invoice({ id: invoice_default.id });

  t.deepEqual(response.err, {
    kind: { NotYetPaid: null },
    message: ["Insufficient balance. Current Balance is 0"]
  });
});

test("Invoice.verify_invoice():[defaultActor]: for invoice_keeper_of_coin, with authorized identities => #err(insufficient balance)", async function (t) {
  const response = await defaultActor.verify_invoice({ id: invoice_keeper_of_coin.id });

  t.deepEqual(response.err, {
    kind: { NotYetPaid: null },
    message: ["Insufficient balance. Current Balance is 0"]
  });
});

// transfer
test("Invoice.transfer():[keeperOfCoinActor]: for invoice_keeper_of_coin => #ok(blockHeight)", async function (t) {
  const response = await keeperOfCoinActor.transfer({
    amount: invoice_keeper_of_coin.amount + transfer_fee,
    token: {
      symbol: "ICP",
    },
    destination: invoice_keeper_of_coin.destination
  });

  const hasBlockHeight = response.ok.blockHeight > 1;

  t.equal(hasBlockHeight, true);
});

// verify_invoice
test("Invoice.verify_invoice():[keeperOfCoinActor]: for invoice_keeper_of_coin => #ok(Paid)", async function (t) {
  const response = await keeperOfCoinActor.verify_invoice({ id: invoice_keeper_of_coin.id });

  let amountPaid = response.ok.Paid.invoice.amountPaid;
  let hasPaid = response.ok.Paid.invoice.paid;

  t.equal(amountPaid, 10000n);
  t.equal(hasPaid, true);
});

// log keeperOfCoinActor balance
test("Invoice.get_balance():[keeperOfCoinActor]: print remaining balance", async function (t) {
  const response = await keeperOfCoinActor.get_balance({ token: { symbol: "ICP" } });

  console.log("Balance: ", response.ok.balance);
});
