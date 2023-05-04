import React, { useState } from "react";
import "../index.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Page } from "../components/app/Layout";
import BrowseQuestion from "./BrowseQuestion";
import AddQuestion from "./AddQuestion";
import Question from "./Question";
import Profile from "./Profile";
import motokoPath from "../../assets/motoko.jpg";
import { _SERVICE as IMarketActor } from "../../declarations/market/market.did.d";
import { _SERVICE as ILedgerActor } from "../../declarations/ledger/ledger.did.d";
import { Principal } from "@dfinity/principal";
import { establishConnection } from "../components/api/plug";
import { IDefaultActor, defaultActor } from "../components/api/plug";
import { ActorContext } from "../components/api/Context";
import { fromNullable } from "@dfinity/utils";

import Header from "../components/app/Header";
import Footer from "../components/app/Footer";
import Notifications from "./Notifications";
import Protected from "../components/app/Protected";

import Button, { LoadingWrapper } from "../components/core/Button";

import { ArrowIcon } from "../components/core/Icons";

import {
	SlateEditor,
	TollbarInstance,
	EditableInstance,
} from "../components/addQuestion/SlateTest";
import { timeout } from "@dfinity/agent/lib/cjs/polling/strategy";

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

/* useEffect(() => {
		// async runing directly
		(async () => {
			const mark = await establishConnection(
				() => console.log("logout"),
				() => console.log("login")
			);
			console.log(mark, "mark");
			setActor(mark);
		})();
	}, []); */

function App() {
	const navigate = useNavigate();

	const [user, setUser] = useState<ICurrentUser>({
		principal: undefined,
		market: defaultActor,
		ledger: undefined,
	});

	const checkIfUserExists = async (principal_id: Principal, get_user) => {
		return fromNullable(await get_user(principal_id));
	};

	const createUserIfNotExists = async (
		principal_id: Principal,
		get_user,
		create_user
	) => {
		let user = await checkIfUserExists(principal_id, get_user);
		if (!user) {
			await create_user("newUser");
		}
	};

	const login: LoginFunction = async () => {
		let plugActor = await establishConnection(login, logout);
		console.log(window.ic.plug.principalId, "window.ic.plug.principalId");
		let res = await createUserIfNotExists(
			Principal.fromText(window.ic.plug.principalId),
			plugActor.market.get_user,
			plugActor.market.create_user
		);
		console.log(res);

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

	/* const [input, setInput] = useState("");
	console.log(input, "input"); */

	// in browser I need to do this: /#/question/1
	return (
		<div className="font-inter">
			{/* <div className={"p-10"}>
				<SlateEditor setInputValue={setInput} inputValue={input}>
					<TollbarInstance />
					<EditableInstance className="border-2" />
				</SlateEditor>
			</div>
			<button
				onClick={() => {
					setInput("");
				}}
			>
				reset input
			</button> */}
			<ActorContext.Provider value={{ user, login, logout }}>
				<Page Header={<Header />}>
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
	);
}
export default App;
