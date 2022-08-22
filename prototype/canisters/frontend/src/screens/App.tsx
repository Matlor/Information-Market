import "../index.css";
import { Route, Routes, HashRouter } from "react-router-dom";

import PageLayout from "../components/app/PageLayout";
import Header from "../components/app/Header";
import Footer from "../components/app/Footer";
import BrowseQuestion from "./BrowseQuestion";

function App() {
	return (
		<PageLayout>
			<HashRouter>
				<Header />
				<Routes>
					<Route path="/" element={<BrowseQuestion />} />
					<Route path="/add-question" />
					<Route path="/question/:id" />
					<Route path="/profile" />
				</Routes>
				<Footer />
			</HashRouter>
		</PageLayout>
	);
}

export default App;
