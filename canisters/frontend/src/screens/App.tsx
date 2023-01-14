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

	const logout = () => {
		setUser({
			principal: undefined,
			market: defaultActor,
			ledger: undefined,
		});
	};

	const login = async () => {
		let plugActor = await establishConnection(login, logout);
		setUser({
			principal: window.ic.plug.principalId,
			// TODO: add ledger
			market: plugActor?.market,
			ledger: plugActor?.ledger,
		});
		navigate("/");
	};

	// TODO: User Management - see below JSX

	return (
		<ActorContext.Provider value={{ user, login, logout }}>
			<PageLayout>
				<Routes>
					<Route path="/" element={<BrowseQuestion />} />
					<Route path="/add-question" element={<AddQuestion />} />
					<Route path="/question/:id" element={<Question />} />
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
