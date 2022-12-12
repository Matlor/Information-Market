import React from "react";

import "../index.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import PageLayout from "../components/app/view/PageLayout";
import BrowseQuestion from "./BrowseQuestion";
import AddQuestion from "./AddQuestion";
import Question from "./Question";
import Profile from "./Profile";

import plugApi from "../components/core/services/plug";
import sudograph from "../components/core/services/sudograph";

import motokoPath from "../../assets/motoko.jpg";

import { blobToBase64Str } from "../components/core/services/utils/conversions";
import Scenario from "../components/core/services/utils/scenario";

function App() {
	const [plug, setPlug] = useState<any>({
		isConnected: false,
		principal: "",
		actors: { marketActor: {}, ledgerActor: {} },
		user: {
			userName: "",
			joinedDate: "",
			avatar: "",
		},
	});

	const navigate = useNavigate();

	const refreshUser = async () => {
		try {
			// verify connetion, if false log out
			if (!(await plugApi.verifyConnection())) {
				logout();
				return;
			}

			// fetch user
			const fetchedUser = await sudograph.fetchUser(plug.principal);
			// if return is ok and above is ok
			if (fetchedUser.data === null || fetchedUser.data.readUser.length === 0) {
				logout();
				return;
			}
			// set user
			setPlug({
				...plug,
				user: {
					...plug.user,
					avatar: blobToBase64Str(fetchedUser.data.readUser[0].avatar),
					userName: fetchedUser.data.readUser[0].name,
				},
			});
		} catch (error) {
			console.error("Failed to get user: " + error);
			logout();
		}
	};

	const updateUserInformation = async (newUserName, newAvatar) => {
		// check connection
		if (!(await plugApi.verifyConnection())) {
			logout();
			return;
		}

		// update inforamtion
		let updateUser = await plug.actors.marketActor.update_user(newUserName, [
			newAvatar,
		]);

		if (!updateUser.ok) {
			console.error("Failed to update user: " + updateUser.err);
		} else {
			refreshUser();
		}
	};

	async function createDefaultAvatar() {
		return new Promise(async (resolve) => {
			let motoko_image = await fetch(motokoPath);
			var reader = new FileReader();
			reader.readAsDataURL(await motoko_image.blob());
			reader.onload = () => {
				resolve(reader.result);
			};
		});
	}

	// 1 establish connection. store plug object in some var. if it has a principal continue.
	// 2 get principal of plug object,
	// 3 pass principal to sudograph function to fetch user. if unsuccessful do 4
	// 4 use plug object in variable to call create user function -> somehow passing userId, name and principal (I think they have to be generated)
	// 5 steSate
	const login = async () => {
		// 1 connect to plug
		const plugObject = await plugApi.establishConnection(logout, login);
		if (Object.keys(plugObject).length === 0) {
			// refresh page with deep copy to stop loading
			// TODO: Get rid of this hack
			setPlug(JSON.parse(JSON.stringify(plug)));
			return;
		}
		// 2 the principal is added to the window object when user signed in
		let principal_id = window.ic.plug.principalId;
		if (!principal_id) {
			return;
		}

		// 3 fetch user
		const user: any = {};
		var resFetchUser = await sudograph.fetchUser(principal_id);
		if (resFetchUser.data === null || resFetchUser.data.readUser.length === 0) {
			// 4 create user
			let createUser = await plugObject.market.create_user("New User");
			if (!createUser.ok) {
				return;
			}
			resFetchUser = await sudograph.fetchUser(principal_id);
		}
		user.userName = resFetchUser.data.readUser[0].name;
		user.joinedDate = resFetchUser.data.readUser[0].joined_date;
		user.avatar = resFetchUser.data.readUser[0].avatar
			? blobToBase64Str(resFetchUser.data.readUser[0].avatar)
			: await createDefaultAvatar();

		// 5
		setPlug({
			isConnected: true,
			principal: principal_id,
			actors: {
				marketActor: plugObject.market,
				ledgerActor: plugObject.ledger,
			},
			user,
		});
	};

	const logout = async () => {
		setPlug({
			isConnected: false,
			principal: "",
			actors: { marketActor: {}, ledgerActor: {} },
			user: {
				userName: "",
				joinedDate: "",
				avatar: "",
			},
		});
		navigate("/");
	};

	/* SCENARIO */
	const [scenarioLoaded, setScenarioLoaded] = useState<boolean>(false);

	useEffect(() => {
		if (!scenarioLoaded) {
			if (process.env.NODE_ENV !== "development") {
				console.log("production");
				return;
			}
			const loadScenario = async () => {
				console.log("loading scnearios");
				try {
					Scenario.loadScenario(
						["Alice", "Bob", "Charlie", "Dan", "Edgar"],
						15,
						60,
						60
					);
				} catch (error) {
					console.error("Failed to load scenario: " + error);
				}
			};
			loadScenario();
			setScenarioLoaded(true);
		}
	}, []);

	return (
		<PageLayout
			isConnected={plug.isConnected}
			login={login}
			logout={logout}
			avatar={plug.user.avatar}
		>
			<Routes>
				<Route
					path="/"
					element={
						<BrowseQuestion
							isConnected={plug.isConnected}
							userPrincipal={plug.principal}
							createDefaultAvatar={createDefaultAvatar}
						/>
					}
				/>
				<Route
					path="/add-question"
					element={
						<AddQuestion
							isConnected={plug.isConnected}
							createInvoice={plug.actors.marketActor.create_invoice}
							transfer={plug.actors.ledgerActor.transfer}
							askQuestion={plug.actors.marketActor.ask_question}
						/>
					}
				/>
				<Route
					path="/question/:id"
					element={
						<Question
							isConnected={plug.isConnected}
							userPrincipal={plug.principal}
							answerQuestion={plug.actors.marketActor.answer_question}
							pickWinner={plug.actors.marketActor.pick_winner}
							triggerDispute={plug.actors.marketActor.trigger_dispute}
							createDefaultAvatar={createDefaultAvatar}
						/>
					}
				/>
				<Route
					path="/profile"
					element={
						<Profile
							isConnected={plug.isConnected}
							user={plug.user}
							updateUserInformation={updateUserInformation}
						/>
					}
				/>
			</Routes>
		</PageLayout>
	);
}

export default App;