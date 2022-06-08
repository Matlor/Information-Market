import { useEffect, useState } from "react";
import { useParams } from "react-router";
import sudograph from "../api/sudograph";

import Open from "./questionPage/Open";
import PickAnswer from "./questionPage/PickAnswer";
import Disputable from "./questionPage/Disputable";
import Arbitration from "./questionPage/Arbitration";
import Closed from "./questionPage/Closed";
import Question from "./Question";

// TODO: Fix deadline issues
const QuestionPage = ({ plug, login }: any) => {
	let { id } = useParams();

	const [questionState, setQuestionState] = useState<any>({
		question: {},
		hasData: false,
		answers: [],
	});

	const [deadline, setDeadline] = useState<any>(0);

	const fetch_data = async () => {
		try {
			const {
				data: { readQuestion },
			} = await sudograph.get_question(id);
			console.log(readQuestion, "question");

			const {
				data: { readAnswer },
			} = await sudograph.get_question_answers(id);
			console.log(readAnswer, "answers");

			const sortedAnswers = readAnswer.sort((a, b) => {
				return a.creation_date - b.creation_date;
			});

			if (readQuestion.length > 0) {
				setQuestionState({
					question: readQuestion[0],
					hasData: true,
					answers: sortedAnswers,
				});

				setDeadline(readQuestion[0].status_end_date);
			}
		} catch (err) {
			// handle error (or empty response)
			console.log(err);
		}
	};

	useEffect(() => {
		fetch_data();
	}, []);

	const showStatusComponents = () => {
		switch (questionState.question.status) {
			case "OPEN":
				return (
					<Open
						questionState={questionState}
						plug={plug}
						fetch_data={fetch_data}
						login={login}
					/>
				);
			case "PICKANSWER":
				return (
					<PickAnswer
						questionState={questionState}
						plug={plug}
						fetch_data={fetch_data}
						login={login}
					/>
				);
			case "DISPUTABLE":
				return (
					<Disputable
						questionState={questionState}
						plug={plug}
						fetch_data={fetch_data}
						login={login}
					/>
				);
			case "DISPUTED":
				return (
					<Arbitration
						questionState={questionState}
						plug={plug}
						fetch_data={fetch_data}
						login={login}
					/>
				);
			case "CLOSED":
				return (
					<Closed
						questionState={questionState}
						plug={plug}
						fetch_data={fetch_data}
						login={login}
					/>
				);
			default:
				return <></>;
		}
	};

	return (
		<>
			<div className="mb-10">
				<h1 className="text-2xl font-medium mr-4"> Question</h1>
			</div>
			{questionState.hasData ? (
				<div className="">
					<Question question={questionState.question} deadline={deadline} />
					{showStatusComponents()}
				</div>
			) : (
				<></>
			)}
		</>
	);
};

export default QuestionPage;
