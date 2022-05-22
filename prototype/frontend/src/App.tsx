import Header from "./components/Header";
import QuestionsList from "./components/QuestionsList";

import { useState, useEffect } from "react";
import { Prototype } from "../../declarations/Prototype/index.js";

// ----------------------------------------------------------------
/*  
Plan:
Component renders by showing a loading sign if nothing is aorund.
Then it runs useEffect in which it updates state once. 




*/
// ----------------------------------------------------------------

function App() {
	useEffect(() => {
		Prototype.get_questions().then((res) => {
			setQuestions(res);
		});
	}, []);

	const [questions, setQuestions] = useState<any>([[{}]]);

	return (
		<div>
			<Header />
			<QuestionsList questions={questions} />
		</div>
	);
}

export default App;
