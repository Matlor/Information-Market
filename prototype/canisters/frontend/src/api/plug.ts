import { idlFactory as idlMarket } from "../../declarations/market";
import { idlFactory as idlledger } from "../../declarations/ledger";

const host = window.location.origin;

const marketCanisterId = process.env.MARKET_CANISTER_ID;
const ledgerCanisterId = process.env.LEDGER_CANISTER_ID;
const invoiceCanisterId = process.env.INVOICE_CANISTER_ID;

const whitelist = [marketCanisterId, ledgerCanisterId, invoiceCanisterId];

const establishConnection = async () => {
	try {
		await window.ic.plug.requestConnect({
			whitelist,
			host,
		});

		var marketActor = await window.ic.plug.createActor({
			canisterId: marketCanisterId,
			interfaceFactory: idlMarket,
		});

		var ledgerActor = await window.ic.plug.createActor({
			canisterId: ledgerCanisterId,
			interfaceFactory: idlledger,
		});

		return { market: marketActor, ledger: ledgerActor };
	} catch (e) {
		console.error("Failed to establish connection: " + e);
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
		console.error("Failed to verify connection: " + e);
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
