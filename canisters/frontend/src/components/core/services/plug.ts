import { idlFactory as idlMarket } from "../../../../declarations/market";
import { idlFactory as idlledger } from "../../../../declarations/ledger";
// TODO: if not needed delete invoice canister / IDL

const host = window.location.origin;

console.log(host, "host");

const marketCanisterId = process.env.MARKET_CANISTER_ID;
const ledgerCanisterId = process.env.LEDGER_CANISTER_ID;
const invoiceCanisterId = process.env.INVOICE_CANISTER_ID;

console.log(marketCanisterId, "marketCanisterId");
console.log(ledgerCanisterId, "ledgerCanisterId");
console.log(invoiceCanisterId, "invoiceCanisterId");

const whitelist = [marketCanisterId, ledgerCanisterId, invoiceCanisterId];

const establishConnection = async (logout, login) => {
	const onConnectionUpdate = () => {
		console.log(window.ic.plug.sessionManager.sessionData);
		logout();
		login();
	};

	try {
		await window.ic.plug.requestConnect({
			whitelist,
			host,
			onConnectionUpdate,
		});

		if (process.env.NODE_ENV !== "production") {
			await window.ic?.plug?.agent?.fetchRootKey();
			console.log(await window.ic?.plug?.agent?.fetchRootKey(), "rootkey");
		}

		var marketActor = await window.ic.plug.createActor({
			canisterId: marketCanisterId,
			interfaceFactory: idlMarket,
		});
		console.log(marketActor, "marketActor");

		var ledgerActor = await window.ic.plug.createActor({
			canisterId: ledgerCanisterId,
			interfaceFactory: idlledger,
		});

		console.log(ledgerActor, "ledgerActor");

		return { market: marketActor, ledger: ledgerActor };
	} catch (e) {
		console.error("Failed to establish connection: " + e);
		if (!window.ic) {
			window.open("https://plugwallet.ooo/");
		}

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
