import { useEffect, useState } from "react";
import { useParams } from "react-router";
import sudograph from "../api/sudograph";

import Body from "./question/Body";
import Open from "./question/Open";
import PickAnswer from "./question/PickAnswer";
import Disputable from "./question/Disputable";
import Arbitration from "./question/Arbitration";
import Closed from "./question/Closed";

// TODO: Fix deadline issues
const Question = ({ plug, login }: any) => {
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
				const newDeadline =
					(readQuestion[0].creation_date + readQuestion[0].open_duration) *
					60 *
					1000;

				setDeadline(newDeadline);
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
					<>
						<Open
							questionState={questionState}
							plug={plug}
							fetch_data={fetch_data}
							login={login}
						/>
					</>
				);
			case "PICKANSWER":
				return (
					<>
						<PickAnswer
							questionState={questionState}
							plug={plug}
							fetch_data={fetch_data}
							login={login}
						/>
					</>
				);
			case "DISPUTABLE":
				return (
					<>
						<Disputable
							questionState={questionState}
							plug={plug}
							fetch_data={fetch_data}
							login={login}
						/>
					</>
				);
			case "ARBITRATION":
				return (
					<>
						<Arbitration
							questionState={questionState}
							plug={plug}
							fetch_data={fetch_data}
							login={login}
						/>
					</>
				);
			case "CLOSED":
				return (
					<>
						{" "}
						<Closed
							questionState={questionState}
							plug={plug}
							fetch_data={fetch_data}
							login={login}
						/>
					</>
				);
			default:
				return <></>;
		}
	};

	return (
		<>
			{questionState.hasData ? (
				<div className="m-20 p-2 border ">
					<Body questionState={questionState} deadline={deadline} />
					{showStatusComponents()}
				</div>
			) : (
				<></>
			)}
		</>
	);
};

export default Question;
