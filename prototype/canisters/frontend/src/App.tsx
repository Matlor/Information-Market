import Header from "./components/Header";
import QuestionsList from "./components/QuestionsList";
import { useState, useEffect } from "react";
import { market, idlFactory } from "../declarations/market/index.js";

function App() {
	// -------------------------- Plug ---------------------------------
	const host = "http://localhost:3000";
	const whitelist = [`${process.env.MARKET_CANISTER_ID}`];

	const [plug, setPlug] = useState<any>({
		isConnected: false,
		plug: {},
		actor: {},
	});

	const login = async () => {
		try {
			await window.ic.plug.requestConnect({
				whitelist,
				host,
			});
			var actor = await window.ic.plug.createActor({
				canisterId: "rno2w-sqaaa-aaaaa-aaacq-cai",
				interfaceFactory: idlFactory,
			});

			setPlug({ isConnected: true, plug: await window.ic.plug, actor: actor });
		} catch (e) {
			console.log(e);
			setPlug({ isConnected: false, plug: {}, actor: {} });
		}
	};

	const logout = async () => {
		setPlug({ isConnected: false, plug: {}, actor: {} });
	};

	// called before using the actor to communicate with backend
	const verifyConnection = async () => {
		try {
			const connected = await window.ic.plug.isConnected();
			if (!connected) await window.ic.plug.requestConnect({ whitelist, host });
			if (connected && !window.ic.plug.agent) {
				await window.ic.plug.createAgent({ whitelist, host });
			}
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	};

	// -------------------------- Questions --------------------------------------
	const [questions, setQuestions] = useState<any>([]);

	useEffect(() => {
		market.get_questions().then((res) => {
			if (res.length > 0) {
				setQuestions(res[0]);
			}
		});
	}, []);

	return (
		<div>
			<Header login={login} logout={logout} plug={plug} />
			<QuestionsList questions={questions} />
		</div>
	);
}

export default App;
