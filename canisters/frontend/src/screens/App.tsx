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
	status: "CLOSED",
	reward: 100,
	title: "This is the title of the question?",
	content:
		"This is the content of the question. It should span across multiple lines to be a good example.",
	invoice_id: 1,
	answers: [1, 2, 3],
	status_end_date: 1000000000,
	status_update_date: 1000000000,
	finalWinner: 10,
	// careful here is principal
	author_id: 1,
	close_transaction_block_height: null,
	open_duration: 1000000000,
	// id not author
	potentialWinner: 10,
	creation_date: 1000000000,
};

const answers = [
	{
		id: 10,
		content: "This is the first answer.",
		isWinner: true,
		author_id: 2,
	},
	{
		id: 20,
		content: "This is the second answer.",
		isWinner: false,
		author_id: 3,
	},
	{
		id: 30,
		content: "This is the third answer.",
		isWinner: false,
		author_id: 4,
	},
];

const user = 2;

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
			<PageLayout>
				<Routes>
					<Route path="/" element={<BrowseQuestion />} />
					<Route path="/add-question" element={<AddQuestion />} />
					<Route
						path="/question/:id"
						element={
							<Question question={question} answers={answers} user={user} />
						}
					/>
					{/* <Route
						path="/profile"
						element={<Profile updateUserInformation={updateUserInformation} />}
					/> */}
				</Routes>
			</PageLayout>
		</ActorContext.Provider>
	);
}
export default App;

/* return (
		<>
			<ActorContext.Provider value={{ user, login, logout }}>
				<LoginTest login={login} logout={logout} />
			</ActorContext.Provider>
		</>
	); */

/* const [plug, setPlug] = useState<IPlug>({
		principal: undefined,
		actors: { marketActor: plugApi.default_actor, ledgerActor: {} },
		user: undefined,
	}); */

// TODO: rename these funcs
/* const refreshUser = async () => {
		try {
			if (!(await plugApi.verifyConnection()) || !plug.principal) {
				logout();
				return;
			} else {
				const fetchedUser = fromNullable(
					await plug.actors.marketActor.get_user(plug.principal)
				);
				if (!fetchedUser) {
					logout();
					return;
				} else {
					setPlug({
						...plug,
						user: fetchedUser,
					});
				}
			}
		} catch (error) {
			console.error("Failed to get user: " + error);
			logout();
		}
	}; */
/* const updateUserInformation = async (newUserName, newAvatar) => {
		if (!(await plugApi.verifyConnection())) {
			logout();
			return;
		} else {
			// TODO: allow to update avatar again
			let updateUser = await plug.actors.marketActor.update_user(newUserName);
			if ("err" in updateUser) {
				console.error("Failed to update user: " + updateUser.err);
			} else {
				refreshUser();
			}
		}
	}; */
// TODO: change input to string if it makes sense with plug
/* const createUser = async (
		principal_id: string,
		create_user,
		name = "newUser"
	) => {
		let createUser = await create_user(name);
		if (!createUser.ok) {
			return;
		} else {
			return fromNullable(
				await plug.actors.marketActor.get_user(Principal.fromText(principal_id))
			);
		}
	}; */
/* const login = async () => {
		const plugObject = await plugApi.establishConnection(logout, login);
		if (Object.keys(plugObject).length === 0) {
			// TODO: replace with deep clone, or shallow copy?
			setPlug(JSON.parse(JSON.stringify(plug)));
			return;
		}
		const principal_id = window.ic.plug.principalId;
		if (!principal_id) {
			return;
		} else {
			var user: FUser = fromNullable(
				await plug.actors.marketActor.get_user(Principal.fromText(principal_id))
			);
			if (!user) {
				user = await createUser(principal_id, plugObject.market.create_user);
				if (!user) {
					// TODO: should certainly be user here make this type wise better
					return;
				}
			}
			setPlug({
				principal: Principal.fromText(principal_id),
				actors: {
					marketActor: plugObject.market,
					ledgerActor: plugObject.ledger,
				},
				user,
			});
		}
	}; */
// TODO: not logged in actor
/* const logout = async () => {
		setPlug({
			principal: undefined,
			actors: { marketActor: {}, ledgerActor: {} },
			user: undefined,
		});
		navigate("/");
	}; */
