import React, { useState } from "react";
import "../index.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Page } from "../components/app/Layout";
import BrowseQuestion from "./BrowseQuestion";
import AddQuestion from "./AddQuestion";
import Question from "./Question";
import Profile from "./Profile";
import { _SERVICE as IMarketActor } from "../../declarations/market/market.did.d";
import { _SERVICE as ILedgerActor } from "../../declarations/ledger/ledger.did.d";
import { Principal } from "@dfinity/principal";
import { establishConnection } from "../components/api/plug";
import { IDefaultActor, defaultActor } from "../components/api/plug";
import { ActorContext } from "../components/api/Context";
import { fromNullable } from "@dfinity/utils";

import Header from "../components/app/Header";
import Notifications from "./Notifications";
import Protected from "../components/app/Protected";
import { Provider } from "@psychedelic/plug-inpage-provider";

export interface ILoggedOutUser {
	principal: undefined;
	market: IDefaultActor;
	ledger: undefined;
}

export interface ILoggedInUser {
	principal: Principal;
	market: IMarketActor;
	ledger: ILedgerActor;
}

export type ICurrentUser = ILoggedOutUser | ILoggedInUser;

export type LoginFunction = () => Promise<void>;
export type LogoutFunction = () => Promise<void>;

function App() {
	const navigate = useNavigate();

	const [user, setUser] = useState<ICurrentUser>({
		principal: undefined,
		market: defaultActor,
		ledger: undefined,
	});

	const login: LoginFunction = async () => {
		let plugActor = await establishConnection(login, logout);

		// create user if it doesn't exist
		let user = fromNullable(
			await plugActor.market.get_user(
				Principal.fromText(window.ic.plug.principalId)
			)
		);
		console.log(user, "user");
		if (!user) {
			console.log(await plugActor.market.create_user());
		}

		setUser({
			principal: window.ic.plug.principalId,
			// TODO: add ledger
			market: plugActor?.market,
			ledger: plugActor?.ledger,
		});
	};

	const logout: LogoutFunction = async () => {
		setUser({
			principal: undefined,
			market: defaultActor,
			ledger: undefined,
		});
		navigate("/");
	};

	// in browser I need to do this: /#/question/1

	return (
		<>
			<div
				id="box"
				className={` noisy min-h-screen font-inter flex flex-col items-center overflow-y-visible w-full `}
			>
				<ActorContext.Provider value={{ user, login, logout }}>
					<Page Header={Header}>
						<Routes>
							<Route
								path="/"
								element={
									<>
										<BrowseQuestion />
									</>
								}
							/>
							<Route
								path="/add-question"
								element={
									<>
										<AddQuestion />
									</>
								}
							/>
							<Route
								path="/question/:id"
								element={
									<>
										<Question user={user} />
									</>
								}
							/>
							<Route
								path="/profile"
								element={
									<Protected principal={user.principal}>
										<Profile logout={logout} principal={user.principal} />
									</Protected>
								}
							/>
							<Route
								path="/notifications"
								element={
									<Protected principal={user.principal}>
										<Notifications />
									</Protected>
								}
							/>
						</Routes>
					</Page>
				</ActorContext.Provider>
			</div>
		</>
	);
}
export default App;
