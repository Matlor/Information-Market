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

	const fetch_data = async () => {
		try {
			const {
				data: { readQuestion },
			} = await sudograph.get_question(id);

			const {
				data: { readAnswer },
			} = await sudograph.get_question_answers(id);

			if (readQuestion[0]) {
				var sortedAnswers = [];

				if (readAnswer.length > 0) {
					sortedAnswers = readAnswer.sort((a, b) => {
						return a.creation_date - b.creation_date;
					});
				}

				setQuestionState({
					question: readQuestion[0],
					hasData: true,
					answers: sortedAnswers,
				});
			}
		} catch (err) {
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
			<h1 className="page-title mb-10"> Question</h1>
			{questionState.hasData ? (
				<>
					<Question question={questionState.question} />
					{showStatusComponents()}
				</>
			) : (
				<></>
			)}
		</>
	);
};

export default QuestionPage;
