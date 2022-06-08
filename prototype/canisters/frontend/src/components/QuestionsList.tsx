import Question from "./Question";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const QuestionsList = ({
	plug,
	title,
	onlyAuthenticated,
	sudographFunction,
}: any) => {
	console.log(onlyAuthenticated);

	if (onlyAuthenticated) {
		if (!plug.isConnected) {
			return <Navigate to="/" replace />;
		}
	}

	const [questions, setQuestions] = useState<any>([]);

	useEffect(() => {
		const fetchQuestions = async () => {
			try {
				const res = await sudographFunction();
				console.log(res);
				setQuestions(res.data.readQuestion);
			} catch (e) {
				console.log(e);
			}
		};

		fetchQuestions();
	}, []);

	return (
		<>
			<h1 className="page-title">{title}</h1>
			<div className=" flex flex-col justify-between">
				{questions.length > 0 ? (
					questions.map((question: any, index: number) => {
						return (
							<div key={index} className="mb-4">
								<Question question={question} />
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
