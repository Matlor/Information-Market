import Header from "./components/Header";
import QuestionsList from "./components/QuestionsList";
import "./App.css";

import { Prototype } from "../../declarations/Prototype/index";

const test = async () => {
	let result = await Prototype.obtain_invoice(BigInt(1250001));
	console.log(result);
};
test();

function App() {
	return (
		<div>
			<Header />
			<QuestionsList />
		</div>
	);
}

export default App;
