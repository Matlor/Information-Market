const { Ed25519KeyIdentity } = require('@dfinity/identity');
const test = require('tape');
const fetch = require('node-fetch');

const { getActor } = require('./actor.cjs');

const canisterIds = require('../.dfx/local/canister_ids.json');
const {
	idlFactory
} = require('../.dfx/local/canisters/Prototype/Prototype.did.test.cjs');

let Jane = Ed25519KeyIdentity.generate();
let John = Ed25519KeyIdentity.generate();

global.fetch = fetch;

const canisterId = canisterIds.Prototype.local;

let prototype = null;

test('Prototype: version()', async function (t) {
	prototype = await getActor(canisterId, idlFactory, Jane);

	const response = await prototype.version();

	console.log("version: ", response);
	t.equal(typeof response, 'string');
});

test('Prototype: obtain_invoice() :: should return reward below minimum', async function (t) {
	prototype = await getActor(canisterId, idlFactory, Jane);

	const response = await prototype.obtain_invoice(10);

	t.deepEqual(response.err, "Reward is below minium");
	t.equal(typeof response.err, 'string');
});
