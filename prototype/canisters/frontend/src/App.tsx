import { Route, Routes, HashRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import plugApi from "./api/plug";
import Header from "./components/Header";
import Landing from "./components/Landing";
import Questions from "./components/Questions";
import Question from "./components/Question";
import Scenario from "./utils/scenario";

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

	Scenario.loadScenario(["Alice", "Bob", "Charlie", "Dan"], 10);

	return (
		<HashRouter>
			<Header plug={plug} login={login} logout={logout} />
			<Routes>
				<Route path="/" element={<Landing plug={plug} />} />
				<Route path="/questions" element={<Questions />} />
				<Route
					path="/question/:id"
					element={<Question plug={plug} login={login} />}
				/>
			</Routes>
		</HashRouter>
	);
}

export default App;
