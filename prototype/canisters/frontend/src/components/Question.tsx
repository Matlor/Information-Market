import { useEffect, useState } from "react";
import { useParams } from "react-router";
import sudograph from "../api/sudograph";

import Body from "./question/Body";
import Status from "./question/Status";

const Question = ({ plug, login }: any) => {
	// Whatever component receives as a URL parameter it will fetch
	// What if I pass invalid id? Maybe it should check for the right format.

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
				const newDeadline = readQuestion[0].creation_date * 60 * 1000 + 120000;
				("deadline creation");

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

	return (
		<>
			{questionState.hasData ? (
				<div className="m-20 p-2 border ">
					<Body questionState={questionState} deadline={deadline} />
					<Status
						questionState={questionState}
						plug={plug}
						fetch_data={fetch_data}
						login={login}
					/>
				</div>
			) : (
				<></>
			)}
		</>
	);
};

export default Question;
