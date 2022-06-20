import { Route, Routes, HashRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import plugApi from "./api/plug";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AddQuestion from "./components/AddQuestion";
import QuestionsList from "./components/QuestionsList";
import Profile from "./components/Profile";
import Question from "./components/QuestionPage";
import Scenario from "./utils/scenario";
import { graphQlToStrDate, blobToBase64Str } from "./utils/conversions";
import { e8sToIcp } from "./utils/conversions";
import { market } from "../declarations/market/index";
import { gql, sudograph } from "sudograph";

function App() {
	const [minRewardIcp, setMinRewardIcp] = useState<number>(-1);
	const [scenarioLoaded, setScenarioLoaded] = useState<boolean>(false);
	const [plug, setPlug] = useState<any>({
		isConnected: false,
		plug: {},
		actors: { marketActor: {}, ledgerActor: {} },
	});
	const [user, setUser] = useState<any>({
		userName: "",
		joinedDate: "",
		avatar: "",
	});

	useEffect(() => {
		// Runs once to get the minimum reward
		const getMinRewardIcp = async () => {
			try {
				const res = await market.get_min_reward();
				if (Number(res)) {
					setMinRewardIcp(e8sToIcp(res));
				}
			} catch (error) {
				console.error("Failed to get min reward: " + error);
			}
		};
		getMinRewardIcp();
	}, []);

	useEffect(() => {
		if (!scenarioLoaded) {
			// Runs once to get minReward
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

	useEffect(() => {
		const refreshUser = async () => {
			// If plug is not connect, empty user info
			if (!plug.isConnected) {
				setUser({ userName: "", joinedDate: "", avatar: "" });
				return;
			}
			// Create a new user if no user has been found
			if (!(await fetchCurrentUser())) {
				console.log("Create new user");
				let motoko_image = await fetch("motoko.jpg");
				var reader = new FileReader();
				reader.readAsDataURL(await motoko_image.blob());
				reader.onloadend = async function () {
					let createUser = await plug.actors.marketActor.create_user(
						window.ic.plug.principalId,
						"New User",
						reader.result
					);
					if (!createUser.ok) {
						setUser({ userName: "", joinedDate: "", avatar: "" });
						console.error("Failed to create a new user!");
						return;
					}
					await fetchCurrentUser();
				};
			}
		};
		refreshUser();
	}, [plug]);

	const fetchCurrentUser = async () => {
		let sudographActor = sudograph({
			canisterId: `${process.env.GRAPHQL_CANISTER_ID}`,
		});
		let principal_id: string = window.ic.plug.principalId;
		const fetchUser = await sudographActor.query(
			gql`
				query ($principal_id: ID!) {
					readUser(search: { id: { eq: $principal_id } }) {
						name
						joined_date
						avatar
					}
				}
			`,
			{ principal_id }
		);
		if (fetchUser.data.readUser.length === 0) {
			setUser({ userName: "", joinedDate: "", avatar: "" });
			return false;
		} else {
			setUser({
				userName: fetchUser.data.readUser[0].name,
				joinedDate: graphQlToStrDate(fetchUser.data.readUser[0].joined_date),
				avatar: blobToBase64Str(fetchUser.data.readUser[0].avatar),
			});
			return true;
		}
	};

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
			console.log("Successfully connect with plug");
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

	const logout = async () => {
		setPlug({
			isConnected: false,
			plug: {},
			actor: {},
		});
	};

	const [cachedAvatars, setCachedAvatars] = useState<any>(() => new Map());

	const loadAvatars = async function (questions: any) {
		try {
			for (var i = 0; i < questions.length; i++) {
				let question: any = questions[i];
				if (!cachedAvatars.has(question.author.id)) {
					await loadAvatar(question.author.id);
				}
				for (var j = 0; j < question.answers.length; j++) {
					let answer: any = question.answers[j];
					if (!cachedAvatars.has(answer.author.id)) {
						await loadAvatar(answer.author.id);
					}
				}
			}
		} catch (error) {
			console.error("Failed to load avatars!");
		}
	};

	const loadAvatar = async (user_id: string) => {
		let sudographActor = sudograph({
			canisterId: `${process.env.GRAPHQL_CANISTER_ID}`,
		});
		const query_avatar = await sudographActor.query(
			gql`
				query ($user_id: ID!) {
					readUser(search: { id: { eq: $user_id } }) {
						avatar
					}
				}
			`,
			{ user_id }
		);
		// TO DO: investigate if fetch + createObjectURL would make more sense
		let avatar = blobToBase64Str(query_avatar.data.readUser[0].avatar);
		setCachedAvatars((prev) => new Map([...prev, [user_id, avatar]]));
	};

	return (
		<div className="flex flex-col min-h-screen bg-secondary justify-between antialiased text-sm font-light">
			<HashRouter>
				<div className="flex flex-col justify-start">
					<Header plug={plug} login={login} user={user} />
					<div className="ml-64 mr-64 mt-4 mb-4">
						<Routes>
							<Route
								path="/"
								element={
									<QuestionsList
										plug={plug}
										cachedAvatars={cachedAvatars}
										loadAvatars={loadAvatars}
									/>
								}
							/>
							<Route
								path="/add-question"
								element={
									<AddQuestion
										plug={plug}
										minRewardIcp={minRewardIcp}
										login={login}
										minTitleCharacters={20}
									/>
								}
							/>
							<Route
								path="/question/:id"
								element={
									<Question
										plug={plug}
										login={login}
										cachedAvatars={cachedAvatars}
										loadAvatars={loadAvatars}
										loadAvatar={loadAvatar}
									/>
								}
							/>
							<Route
								path="/profile"
								element={
									<Profile
										plug={plug}
										user={user}
										fetchCurrentUser={fetchCurrentUser}
										logout={logout}
									/>
								}
							/>
						</Routes>
					</div>
				</div>
				<Footer/>
			</HashRouter>
		</div>
	);
}

export default App;
