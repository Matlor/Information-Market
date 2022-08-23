import "../index.css";
import { Route, Routes, HashRouter } from "react-router-dom";
import { useEffect, useState } from "react";

import PageLayout from "../components/app/PageLayout";
import Header from "../components/app/Header";
import Footer from "../components/app/Footer";
import BrowseQuestion from "./BrowseQuestion";
import Profile from "./Profile";

import plugApi from "../api/plug";
import { gql, sudograph } from "sudograph";
import userManagement from "../components/app/userManagement";

function App() {
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
		userManagement.refreshUser(setUser, plug, sudograph, gql);
	}, [plug]);

	return (
		<PageLayout>
			<HashRouter>
				<Header login={() => plugApi.login(setPlug)} />
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
									userManagement.fetchCurrentUser(setUser, sudograph, gql)
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