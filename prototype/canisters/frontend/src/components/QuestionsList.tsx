import QuestionPreview from "./QuestionPreview";
import { useState, useEffect } from "react";
import sudograph from "../api/sudograph";

const QuestionsList = ({}: any) => {
	console.log(sudograph, "sudograph");

	const [questions, setQuestions] = useState<any>([]);

	useEffect(() => {
		// not checking for error
		const fetchQuestions = async () => {
			const res = await sudograph.get_questions();
			console.log(res.data.readQuestion);
			setQuestions(res.data.readQuestion);
		};

		fetchQuestions();
	}, []);

	return (
		<>
			<h1 className="text-2xl font-medium">Browse Questions</h1>
			<div className=" flex flex-col justify-between">
				{questions.length > 0 ? (
					questions.map((question: any, index: number) => {
						return (
							<div key={index}>
								<QuestionPreview question={question} />
							</div>
						);
					})
				) : (
					<div></div>
				)}
			</div>
		</>
	);
};

export default QuestionsList;
