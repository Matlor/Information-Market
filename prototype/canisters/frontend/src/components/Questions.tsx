import QuestionPreview from "./QuestionPreview";
import { useState, useEffect } from "react";
import sudograph from "../api/sudograph";

const Questions = ({}: any) => {
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
		<div className="ml-96 mr-96 mt-20 mb-5 ">
			<h1 className="text-2xl font-medium">Browse Questions</h1>
			<div className=" flex flex-col justify-between">
				{questions.length > 0 ? (
					questions.map((question: any, index: number) => {
						return (
							<div
								key={index}
								className="pb-10 pt-14 border-b-2 border-secondary"
							>
								<QuestionPreview question={question} />
							</div>
						);
					})
				) : (
					<div></div>
				)}
			</div>
		</div>
	);
};

export default Questions;
