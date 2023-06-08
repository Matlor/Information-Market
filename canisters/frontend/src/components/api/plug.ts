import { idlFactory as idlMarket, market } from "../../../declarations/market";
import { idlFactory as idlledger } from "../../../declarations/ledger";
import { _SERVICE as IMarketActor } from "../../../declarations/market/market.did.d";
import { plug } from "./PlugMobile";

// TODO: could make same type as plug but excluding all the update functions
export interface IDefaultActor {
	get_conditional_questions: IMarketActor["get_conditional_questions"];
	get_conditional_questions_with_authors: IMarketActor["get_conditional_questions_with_authors"];
	get_controllers: IMarketActor["get_controllers"];
	get_db: IMarketActor["get_db"];
	get_duration_disputable: IMarketActor["get_duration_disputable"];
	get_duration_pick_answer: IMarketActor["get_duration_pick_answer"];
	get_fee: IMarketActor["get_fee"];
	get_min_reward: IMarketActor["get_min_reward"];
	get_question_data: IMarketActor["get_question_data"];
	get_update_status_on_heartbeat: IMarketActor["get_update_status_on_heartbeat"];
	get_user: IMarketActor["get_user"];
	get_users: IMarketActor["get_users"];
}

export const defaultActor: IDefaultActor = {
	get_conditional_questions: market.get_conditional_questions,
	get_conditional_questions_with_authors:
		market.get_conditional_questions_with_authors,
	get_controllers: market.get_controllers,
	get_db: market.get_db,
	get_duration_disputable: market.get_duration_disputable,
	get_duration_pick_answer: market.get_duration_pick_answer,
	get_fee: market.get_fee,
	get_min_reward: market.get_min_reward,
	get_question_data: market.get_question_data,
	get_update_status_on_heartbeat: market.get_update_status_on_heartbeat,
	get_user: market.get_user,
	get_users: market.get_users,
};

const marketCanisterId = process.env.MARKET_CANISTER_ID;
const ledgerCanisterId = process.env.LEDGER_CANISTER_ID;

const whitelist = [marketCanisterId, ledgerCanisterId];
const host = window.location.origin;

export const establishConnection = async (logout, login) => {
	console.log(whitelist, host);
	console.log("establishing connection");
	const onConnectionUpdate = () => {
		console.log(plug.sessionManager.sessionData);
		logout();
		login();
	};

	console.log("after onConnectionUpdate");

	try {
		console.log(
			await plug.requestConnect({
				whitelist,
				host,
				onConnectionUpdate,
			}),
			"request connect"
		);

		console.log("requested connection");

		if (process.env.NODE_ENV !== "production") {
			await plug?.agent?.fetchRootKey();
			console.log(await plug?.agent?.fetchRootKey(), "rootkey");
		}

		var marketActor = await plug.createActor({
			canisterId: marketCanisterId,
			interfaceFactory: idlMarket,
		});

		var ledgerActor = await plug.createActor({
			canisterId: ledgerCanisterId,
			interfaceFactory: idlledger,
		});

		return { market: marketActor, ledger: ledgerActor };
	} catch (e) {
		console.error("Failed to establish connection: " + e);
		if (!window.ic) {
			window.open("https://plugwallet.ooo/");
		}
	}
};

export const checkConnection = async () => {
	return plug.isConnected();
};
