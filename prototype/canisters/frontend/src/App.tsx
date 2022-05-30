import { Route, Routes, HashRouter } from "react-router-dom";
import { useState } from "react";
import plugApi from "./api/plug";
import Header from "./components/Header";
import Landing from "./components/Landing";
import Questions from "./components/Questions";

function App() {
	const [plug, setPlug] = useState<any>({
		isConnected: false,
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
		<HashRouter>
			<Header plug={plug} login={login} logout={logout} />
			<Routes>
				<Route path="/" element={<Landing plug={plug} />} />
				<Route path="/questions" element={<Questions />} />
			</Routes>
		</HashRouter>
	);
}

export default App;
