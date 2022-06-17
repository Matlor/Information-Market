import { Route, Routes, HashRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import plugApi from "./api/plug";
import Header from "./components/Header";
import AddQuestion from "./components/AddQuestion";
import QuestionsList from "./components/QuestionsList";
import Question from "./components/QuestionPage";
import Scenario from "./utils/scenario";
import { graphQlToStrDate, blobToBase64Str } from "./utils/conversions";

import { market } from "../declarations/market/index";
import { gql, sudograph } from "sudograph";

function App() {

	const [minReward, setMinReward] = useState<any>(null);

	useEffect(() => {
		// Runs once to get minReward
		const getMinReward = async () => {
			try {
				const res = await market.get_min_reward();
				if (Number(res)) {
					setMinReward(Number(res));
				}
			} catch (error) {
				console.log("Failed to get min reward: " + error);
			}
		};
		getMinReward();
	}, []);

	const [scenarioLoaded, setScenarioLoaded] = useState<boolean>(false);

	useEffect(() => {
		if (!scenarioLoaded){
			// Runs once to get minReward
			const loadScenario = async () => {
				try {
					let motoko_image = await fetch('motoko.jpg');
					var reader = new FileReader();
					reader.readAsDataURL(await motoko_image.blob());
					reader.onloadend = async function() {
						Scenario.loadScenario(
							[
								"Alice",
								"Bob",
								"Charlie",
								"Dan",
								"Edgar",
							],
							14,
							60,
							60,
							reader.result
						);
					}
				} catch (error){
					console.log("Failed to load scenario: " + error);
				}
			};
			loadScenario();
			setScenarioLoaded(true);
		}
	}, []);

	const [plug, setPlug] = useState<any>({
		isConnected: false,
		userName: "",
		joinedDate: "",
		avatar: "",
		plug: {},
		actors: { marketActor: {}, ledgerActor: {} },
	});

	const fetchCurrentUser = async () => {
		console.log("Get user") // @todo

		let sudographActor = sudograph({
			canisterId: `${process.env.GRAPHQL_CANISTER_ID}`,
		});

		let principal_id : string = window.ic.plug.principalId;
		console.log("Current principal is: " + principal_id) // @todo

		const fetchUser = await sudographActor.query(
			gql`
			query ($principal_id:ID!) {
				readUser (search: {id: {eq: $principal_id} } ) {
					name
					joined_date
					avatar
				}
			}
		`,{principal_id});

		console.log("User query result: " + JSON.stringify(fetchUser)); // @todo

		return fetchUser.data.readUser;
	}

	const login = async () => {

		const res = await plugApi.establishConnection();

		if (Object.keys(res).length === 0) {
			console.log("Failed to establish plug connection!");
			setPlug({ isConnected: false, userName: "", joinedDate: "", avatar: "", plug: {}, actor: {} });
			return;
		}

		let fetchUser = await fetchCurrentUser();
		
		if (fetchUser.length > 0){
			setPlug({
				isConnected: true,
				userName: fetchUser[0].name,
				joinedDate: graphQlToStrDate(fetchUser[0].joined_date),
				avatar: blobToBase64Str(fetchUser[0].avatar),
				plug: await window.ic.plug,
				actors: {
					marketActor: res.market,
					ledgerActor: res.ledger,
				},
			});
			return;
		}

		console.log("Create new user"); // @todo
		let motoko_image = await fetch('motoko.jpg');
		var reader = new FileReader();
		reader.readAsDataURL(await motoko_image.blob());
		reader.onloadend = async function() {
			let createUser = await res.market.create_user("New User", reader.result);
			if (!createUser.ok) {
				console.log("Failed to create a new user!");
				setPlug({ isConnected: false, userName: "", joinedDate: "", avatar: "", plug: {}, actor: {} });
				return;
			}
			let fetchNewUser = await fetchCurrentUser();
			if (fetchNewUser.length == 0) {
				console.log("Failed to fetch the new user!");
				setPlug({ isConnected: false, userName: "", joinedDate: "", avatar: "", plug: {}, actor: {} });
				return;
			}
			setPlug({
				isConnected: true,
				userName: fetchNewUser[0].name,
				joinedDate: graphQlToStrDate(fetchNewUser[0].joined_date),
				avatar: blobToBase64Str(fetchNewUser[0].avatar),
				plug: await window.ic.plug,
				actors: {
					marketActor: res.market,
					ledgerActor: res.ledger,
			}});
		}
	};

	const logout = async () => {
		setPlug({ isConnected: false, userName: "", joinedDate: "", avatar: "", plug: {}, actor: {} });
	};

	const [cachedAvatars, setCachedAvatars] = useState<any>(() => new Map());

	const loadAvatars = async function (questions: any) {
		try {
			for (var i = 0; i < questions.length; i++){
				let question : any = questions[i];
				if (!(cachedAvatars.has(question.author.id))){
					await loadAvatar(question.author.id);
				}
				for (var j = 0; j < question.answers.length; j++){
					let answer : any = question.answers[j];
					if (!(cachedAvatars.has(answer.author.id))){
						await loadAvatar(answer.author.id);
					}
				}
			}
		} catch (error) {
			console.log("Failed to load avatars!");
		}
	};

	const loadAvatar = async (user_id: string) => {
		let sudographActor = sudograph({
			canisterId: `${process.env.GRAPHQL_CANISTER_ID}`,
		});
		const query_avatar = await sudographActor.query(
			gql`
				query ($user_id:ID!) {
					readUser(search: {id: {eq: $user_id} }) {
						avatar
					}
				}`, {user_id});
		// TO DO: investigate if fetch + createObjectURL would make more sense
		let avatar = blobToBase64Str(query_avatar.data.readUser[0].avatar);
		setCachedAvatars(prev => new Map([...prev, [user_id, avatar]]));
	}

	return (
		<div className="bg-secondary antialiased text-sm min-h-screen pb-40 font-light">
			<HashRouter>
				<Header plug={plug} login={login} logout={logout} />
				<div className="ml-64 mr-64 mt-10 mb-5">
					<Routes>
						<Route path="/" element={<QuestionsList plug={plug} cachedAvatars={cachedAvatars} loadAvatars={loadAvatars} />} />

						<Route
							path="/add-question"
							element={<AddQuestion plug={plug} minReward={minReward} />}
						/>
						<Route
							path="/question/:id"
							element={<Question plug={plug} login={login} cachedAvatars={cachedAvatars} loadAvatars={loadAvatars} loadAvatar={loadAvatar} />}
						/>
					</Routes>
				</div>
			</HashRouter>
		</div>
	);
}

export default App;
