import "../index.css";
import { Route, Routes, HashRouter } from "react-router-dom";
import { useEffect, useState } from "react";

import PageLayout from "../components/app/PageLayout";
import Header from "../components/app/Header";
import Footer from "../components/app/Footer";
import BrowseQuestion from "./BrowseQuestion";
import Profile from "./Profile";

import plugApi from "../api/plug";
import sudograph from "../api/sudograph";
import { graphQlToStrDate, blobToBase64Str } from "../utils/conversions";

import Scenario from "../utils/scenario";

function App() {
	const [plug, setPlug] = useState<any>({
		isConnected: false,
		plug: {},
		actors: { marketActor: {}, ledgerActor: {} },
	});

	const login = async () => {
		const res = await plugApi.establishConnection();

		if (Object.keys(res).length === 0) {
			console.error("Failed to establish plug connection!");
			setPlug({
				isConnected: false,
				plug: {},
				actor: {},
			});
		} else {
			console.log("Successfully connected with plug");
			setPlug({
				isConnected: true,
				plug: await window.ic.plug,
				actors: {
					marketActor: res.market,
					ledgerActor: res.ledger,
				},
			});
		}
	};

	const logout = async (setPlug) => {
		setPlug({
			isConnected: false,
			plug: {},
			actor: {},
		});
	};

	/* USER DATA FETCHING */
	const [user, setUser] = useState<any>({
		userName: "",
		joinedDate: "",
		avatar: "",
	});

	useEffect(() => {
		const fetchCurrentUser = async () => {
			const user = await sudograph.fetchUser(plug.plug.principalId);
			if (user.data === null || user.data.readUser.length === 0) {
				setUser({ userName: "", joinedDate: "", avatar: "" });
			} else {
				setUser({
					userName: user.data.readUser[0].name,
					joinedDate: graphQlToStrDate(user.data.readUser[0].joined_date),
					avatar: blobToBase64Str(user.data.readUser[0].avatar),
				});
			}
		};
		fetchCurrentUser();
	}, [plug]);

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
					<Route path="/add-question" />
					<Route path="/question/:id" />
					<Route
						path="/profile"
						element={
							<Profile
								plug={plug}
								logout={() => plugApi.logout(setPlug)}
								user={user}
								fetchCurrentUser={() =>
									userManagement.fetchCurrentUser(setUser)
								}
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
