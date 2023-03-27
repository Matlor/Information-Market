import React, { useState } from "react";
import "../index.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import PageLayout from "../components/app/PageLayout";
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
import UI from "./UI";

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

// -----------------  Question Sample Data (delete later) -----------------------

// TODO: can the provisionary winner trigger a dispute on the backend?
const question = {
	id: 1,
	status: "PICKANSWER",
	reward: 3.11,
	title:
		"Das ipsum dolor sit amet, con sect etur adipiscing elit. Praesent eu -ismod, lorem eget viverra luctus, orci eros venenatis?  ",
	content:
		"So, I sold a rental property and have approximately $300k just sitting in the bank at the moment. I'm not feeling like it's a good time to buy another property, but I could be wrong.So, I sold a rental property and have approximately $300k just sitting in the bank at the momen.",
	invoice_id: 1,
	answers: [1, 2, 3],
	status_end_date: 27993944,
	status_update_date: 27984398,
	finalWinner: 10,
	// careful here is principal
	author_id: 1,

	close_transaction_block_height: null,
	open_duration: 60,
	// id not author
	potentialWinner: 10,
	creation_date: 21984398,
};

const answers = [
	{
		id: 10,
		content:
			"Yeah I don think this is true. You see it’s more ahout other things. I belive we can agree to say that.",
		isWinner: true,
		author_id: Principal.fromText("aaaaa-aa"),
		creation_date: 21984398,
	},
	{
		id: 20,
		content:
			"Also mention to Andrew that guys in Microsoft send us positive request. Also mention to Andrew that guys in Microsoft send us positive request Also mention to Andrew that guys in Microsoft send us positive request Also mention to Andrew that guys in Microsoft send us positive request Also mention to Andrew that guys in Microsoft send us positive request.",
		isWinner: false,
		author_id: Principal.fromText(
			"tsm3f-vuuza-xfy3b-wcbrx-r4nzg-jy6o2-ydpbq-67lqa-rgq6j-ijkaa-aqe"
		),
		creation_date: 21984398,
	},
	{
		id: 30,
		content:
			"Yeah I don think this is true. You see it’s more ahout other things. I belive we can agree to say that. Yeah I don think this is true. You see it’s more ahout other things. I belive we can agree to say that.",
		isWinner: false,
		author_id: Principal.fromText(
			"4x6qx-tmjtk-uzyzt-ihfyt-3xeeg-aml4y-5v64i-v6u3x-scyy2-mobv5-pae"
		),
		creation_date: 21984398,
	},
];

const user = 1;

// ---------------------------------------------------
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

	const [user, setUser] = useState<ILoggedInUser | ILoggedOutUser>({
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

	const login = async () => {
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

	const logout = () => {
		setUser({
			principal: undefined,
			market: defaultActor,
			ledger: undefined,
		});
		navigate("/");
	};

	// in browser I need to do this: /#/question/1
	return (
		<ActorContext.Provider value={{ user, login, logout }}>
			<Routes>
				<Route
					path="/"
					element={
						<>
							<Header
								isConnected={user.principal ? true : false}
								login={login}
								logout={logout}
								avatar={""}
							/>

							<PageLayout>
								<BrowseQuestion />
							</PageLayout>
						</>
					}
				/>
				<Route
					path="/add-question"
					element={
						<>
							<Header
								isConnected={user.principal ? true : false}
								login={login}
								logout={logout}
								avatar={""}
							/>
							<PageLayout>
								<AddQuestion />
							</PageLayout>
						</>
					}
				/>
				<Route
					path="/question/:id"
					element={
						<>
							<Header
								isConnected={user.principal ? true : false}
								login={login}
								logout={logout}
								avatar={""}
							/>
							<PageLayout>
								<Question
									question={question}
									answers={answers}
									user={user}
									login={login}
								/>
							</PageLayout>
						</>
					}
				/>
				<Route
					path="/profile"
					element={
						<Protected principal={user.principal}>
							<Header
								isConnected={user.principal ? true : false}
								login={login}
								logout={logout}
								avatar={""}
							/>
							<PageLayout>
								<Profile logout={logout} />
							</PageLayout>
						</Protected>
					}
				/>
				<Route
					path="/notifications"
					element={
						<Protected principal={user.principal}>
							<Header
								isConnected={user.principal ? true : false}
								login={login}
								logout={logout}
								avatar={""}
							/>
							<PageLayout>
								<Notifications />
							</PageLayout>
						</Protected>
					}
				/>
				<Route
					path="/Test"
					element={
						<PageLayout>
							<UI />
						</PageLayout>
					}
				/>
			</Routes>
		</ActorContext.Provider>
	);
}
export default App;
