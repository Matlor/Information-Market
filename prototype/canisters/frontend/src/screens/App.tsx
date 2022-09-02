import "../index.css";
import { Route, Routes, HashRouter } from "react-router-dom";
import { useEffect, useState } from "react";

import PageLayout from "../components/app/view/PageLayout";
import Header from "../components/app/view/Header";
import Footer from "../components/app/view/Footer";
import BrowseQuestion from "./BrowseQuestion";
import Profile from "./Profile";

import plugApi from "../components/core/services/plug";
import sudograph from "../components/core/services/sudograph";

import {
	graphQlToStrDate,
	blobToBase64Str,
} from "../components/core/services/utils/conversions";
import Scenario from "../components/core/services/utils/scenario";

import AddQuestion from "./AddQuestion";

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

	// 1 establish connection. store plug object in some var. if it has a principal continue.
	// 2 get principal of plug object,
	// 3 pass principal to sudograph function to fetch user. if unsuccessful do 4
	// 4 use plug object in variable to call create user function -> somehow passing userId, name and principal (I think they have to be generated)
	// 5 steSate

	const login = async () => {
		// 1 connect to plug
		const plugObject = await plugApi.establishConnection();
		if (Object.keys(plugObject).length === 0) {
			return;
		}

		// 2 the principal is added to the window object when user signed in
		let principal_id = window.ic.plug.principalId;
		if (!principal_id) {
			return;
		}

		// 3 fetch user
		const user: any = {};
		const resFetchUser = await sudograph.fetchUser(principal_id);

		if (resFetchUser.data === null || resFetchUser.data.readUser.length === 0) {
			// 4 create user
			// TO DO: check with latest backend
			// in latest backend we only pass name and avatar (principal comes from plug)
			let createUser = await plugObject.market.create_user(
				principal_id,
				"New User",
				"avatar"
			);

			if (!createUser.ok) {
				console.error("Failed to create a new user!");
				return;
			}
			user.userName = resFetchUser.name;
			user.joinedDate = graphQlToStrDate(resFetchUser.joined_date);

			// avatar not considered
		} else {
			// user existed, therefore store data in user variable
			user.userName = resFetchUser.data.readUser[0].name;
			user.joinedDate = graphQlToStrDate(
				resFetchUser.data.readUser[0].joined_date
			);
			user.avatar = blobToBase64Str(resFetchUser.data.readUser[0].avatar);
		}

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

	const logout = async (setPlug) => {
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
	};

	/* SCENARIO */
	const [scenarioLoaded, setScenarioLoaded] = useState<boolean>(false);

	useEffect(() => {
		if (!scenarioLoaded) {
			const loadScenario = async () => {
				try {
					let motoko_image = await fetch("motoko.jpg");
					var reader = new FileReader();
					reader.readAsDataURL(await motoko_image.blob());
					reader.onloadend = async function () {
						Scenario.loadScenario(
							["Alice", "Bob", "Charlie", "Dan", "Edgar"],
							14,
							60,
							60,
							reader.result
						);
					};
				} catch (error) {
					console.error("Failed to load scenario: " + error);
				}
			};
			loadScenario();
			setScenarioLoaded(true);
		}
	}, []);

	return (
		<PageLayout>
			<HashRouter>
				<Header login={login} />

				<Routes>
					<Route path="/" element={<BrowseQuestion plug={plug} />} />
					<Route path="/add-question" element={<AddQuestion plug={plug} />} />
					<Route path="/question/:id" />
					<Route
						path="/profile"
						element={
							<Profile
								plug={plug}
								logout={() => plugApi.logout(setPlug)}
								user={user}
								fetchCurrentUser={console.log("missing props")}
							/>
						}
					/>
				</Routes>

				<Footer />
			</HashRouter>
		</PageLayout>
	);
}

export default App;
