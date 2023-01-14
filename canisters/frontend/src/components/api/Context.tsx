import { createContext } from "react";
import { Market as IMarketActor } from "../../../declarations/market/market.did.d";
import { _SERVICE as ILedgerActor } from "../../../declarations/ledger/ledger.did.d";
import { Principal } from "@dfinity/principal";

import { IDefaultActor, defaultActor } from "./plug";

interface ILoggedOutUser {
	principal: undefined;
	market: IDefaultActor;
	ledger: undefined;
}

interface ILoggedInUser {
	principal: Principal;
	market: IMarketActor;
	ledger: ILedgerActor;
}

interface IActorContext {
	user: ILoggedInUser | ILoggedOutUser;
	login: React.Dispatch<React.SetStateAction<ILoggedInUser | ILoggedOutUser>>;
	logout: React.Dispatch<React.SetStateAction<ILoggedInUser | ILoggedOutUser>>;
}

export const ActorContext = createContext<IActorContext>({
	user: { principal: undefined, market: defaultActor, ledger: undefined },
	login: () => {},
	logout: () => {},
});
