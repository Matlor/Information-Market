import { useState } from "react";
import Header from "./components/Header";
import QuestionsList from "./components/QuestionsList";
import "./App.css";

function App() {
	return (
		<div>
			<Header />
			<QuestionsList />
		</div>
	);
}

export default App;
