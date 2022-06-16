import { Route, Routes, HashRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import plugApi from "./api/plug";
import Header from "./components/Header";
import AddQuestion from "./components/AddQuestion";
import QuestionsList from "./components/QuestionsList";
import Question from "./components/QuestionPage";
import Scenario from "./utils/scenario";

import { market } from "../declarations/market/index";

function App() {
	const [minReward, setMinReward] = useState<any>(null);
	useEffect(() => {
		// Runs once to get minReward
		const getMinReward = async () => {
			let motoko = await fetch('/images/motoko.jpg');
			var reader = new FileReader();
			reader.readAsDataURL(await motoko.blob());
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

			try {
				const res = await market.get_min_reward();

				if (Number(res)) {
					setMinReward(Number(res));
				}
			} catch (e) {
				console.log(e);
			}
		};
		getMinReward();
	}, []);

	const [plug, setPlug] = useState<any>({
		isConnected: false,
		// might not be necessary
		plug: {},
		actors: { marketActor: {}, ledgerActor: {} },
	});

	const login = async () => {
		const res = await plugApi.establishConnection();

		if (Object.keys(res).length !== 0) {
			setPlug({
				isConnected: true,
				plug: await window.ic.plug,
				actors: {
					marketActor: res.market,
					ledgerActor: res.ledger,
				},
			});
		} else {
			setPlug({ isConnected: false, plug: {}, actor: {} });
		}
	};

	const logout = async () => {
		setPlug({ isConnected: false, plug: {}, actor: {} });
	};

	return (
		<div className="bg-secondary antialiased text-sm min-h-screen pb-40 font-light">
			<HashRouter>
				<Header plug={plug} login={login} logout={logout} />
				<div className="ml-64 mr-64 mt-10 mb-5">
					<Routes>
						<Route path="/" element={<QuestionsList plug={plug} />} />

						<Route
							path="/add-question"
							element={<AddQuestion plug={plug} minReward={minReward} />}
						/>
						<Route
							path="/question/:id"
							element={<Question plug={plug} login={login} />}
						/>
					</Routes>
				</div>
			</HashRouter>
		</div>
	);
}

export default App;
