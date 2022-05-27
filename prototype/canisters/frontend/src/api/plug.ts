import { idlFactory } from "../../declarations/market/index";

// ledger should be in same folder
import { idlFactory as idlledger } from "../../../../../../invoice-canister/.dfx/local/canisters/ledger/index";

// only temporary, ids should all come from process.env
const host = "http://localhost:3000";
const marketCanisterId = process.env.MARKET_CANISTER_ID;
const ledgerCanisterId = "rrkah-fqaaa-aaaaa-aaaaq-cai";
const invoiceCanisterId = "r7inp-6aaaa-aaaaa-aaabq-cai";
const whitelist = [marketCanisterId, ledgerCanisterId, invoiceCanisterId];

const establishConnection = async () => {
	try {
		const principal = await window.ic.plug.requestConnect({
			whitelist,
			host,
		});

		var marketActor = await window.ic.plug.createActor({
			canisterId: marketCanisterId,
			interfaceFactory: idlFactory,
		});

		var ledgerActor = await window.ic.plug.createActor({
			canisterId: "rrkah-fqaaa-aaaaa-aaaaq-cai",
			interfaceFactory: idlledger,
		});

		return { market: marketActor, ledger: ledgerActor };
	} catch (e) {
		console.log(e);
		return {};
	}
};

const verifyConnection = async () => {
	try {
		const connected = await window.ic.plug.isConnected();
		if (!connected) await window.ic.plug.requestConnect({ whitelist, host });
		if (connected && !window.ic.plug.agent) {
			await window.ic.plug.createAgent({ whitelist, host });
		}
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
};

const batchTransaction = async (array: Array<any>) => {
	var result = await window.ic.plug.batchTransactions(array);
	return result;
};

export default {
	establishConnection,
	verifyConnection,
	batchTransaction,
};
