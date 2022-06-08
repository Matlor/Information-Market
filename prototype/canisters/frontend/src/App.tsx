import { Route, Routes, HashRouter, Navigate } from "react-router-dom";
import { useState } from "react";
import plugApi from "./api/plug";
import Header from "./components/Header";
import AddQuestion from "./components/AddQuestion";
import QuestionsList from "./components/QuestionsList";
import Question from "./components/QuestionPage";
import Scenario from "./utils/scenario";
import sudograph from "./api/sudograph";

function App() {
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

	Scenario.loadScenario(
		[
			"Alice",
			"Bob",
			"Charlie",
			"Dan",
			"5komm-kxkxj-hwidx-mjmkr-hhju6-tz22f-ur2wt-iehob-jkw5b-osbtl-bqe",
		],
		14,
		60,
		60,
		1250000,
		100000000
	);

	return (
		<div className="bg-secondary antialiased text-sm min-h-screen pb-40 font-light">
			<HashRouter>
				<Header plug={plug} login={login} logout={logout} />
				<div className=" ml-80 mr-80 mt-10 mb-5">
					<Routes>
						<Route
							path="/"
							element={
								<QuestionsList
									key={1}
									title={"Browse Questions"}
									plug={plug}
									onlyAuthenticated={false}
									sudographFunction={sudograph.get_questions}
								/>
							}
						/>

						<Route
							path="/interactions"
							element={
								<QuestionsList
									key={2}
									title={"My Interactions"}
									plug={plug}
									onlyAuthenticated={true}
									sudographFunction={() =>
										sudograph.get_questions_interactions(plug.plug.principalId)
									}
								/>
							}
						/>

						<Route path="/add-question" element={<AddQuestion plug={plug} />} />
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
