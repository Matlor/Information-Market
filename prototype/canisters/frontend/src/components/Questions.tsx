import QuestionPreview from "./QuestionPreview";
import { useState, useEffect } from "react";
import sudograph from "../api/sudograph";

const Questions = ({}: any) => {
	console.log(sudograph, "sudograph");

	useEffect(() => {
		// not checking for error
		const fetchQuestions = async () => {
			const res = await sudograph.get_questions();
			console.log(res.data.readQuestion);
			setQuestions(res.data.readQuestion);
		};

		fetchQuestions();
	}, []);

	const [questions, setQuestions] = useState<any>([]);

	return (
		<div className="ml-72 mr-72 mt-14 mb-5">
			{questions.length > 0 ? (
				questions.map((question: any, index: number) => {
					return (
						<div key={index}>
							<QuestionPreview question={question} />
						</div>
					);
				})
			) : (
				<div>No list</div>
			)}
		</div>
	);
};

export default Questions;
