import { useEffect, useState } from "react";
import { useParams } from "react-router";
import sudograph from "../api/sudograph";
import SubmitAnswer from "./question/SubmitAnswer";
import Body from "./question/Body";
import AnswerList from "./question/AnswerList";

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

	const statusRlatedComponent = () => {
		// work in progress
		switch (questionState.question.status) {
			case "OPEN":
				return (
					<SubmitAnswer
						plug={plug}
						fetch_data={fetch_data}
						login={login}
						id={id}
					/>
				);
			case "PICKANSWER":
				return <></>;
			case "DISPUTABLE":
				return <></>;
			case "DISPUTED":
				return <></>;
			case "CLOSED":
				return <></>;
			default:
				return <></>;
		}
	};

	return (
		<>
			{questionState.hasData ? (
				<div className="m-20 p-2 border ">
					<Body questionState={questionState} deadline={deadline} />
					{statusRlatedComponent()}
					<AnswerList
						questionState={questionState}
						fetch_data={fetch_data}
						id={id}
						plug={plug}
					/>
				</div>
			) : (
				<></>
			)}
		</>
	);
};

export default Question;

// if call fails it should render an error message
// should not render anything until call fails or loading.

/* const [hidden, setHidden] = useState<any>("hidden");

	const handleMouseEnter = () => {
		setHidden("");
	};
	const handleMouseLeave = () => {
		setHidden("hidden");
	}; */

// take beginning value
// add 1 hour to it
// transform deadline to seconds
// regularly check time to seconds, take difference and set state

// creation_date seems to be in hour/1000

/* 
		onMouseEnter={handleMouseEnter}
		onMouseLeave={handleMouseLeave}

			<div className="peer-test font-light text-xs">
				{answer.id}
			</div>

       for user: {questionState.question.author.slice(0, 5)}

	   Deadline:
		{new Date(
			questionState.question.creation_date * 60 * 1000 * 1000
		).toLocaleString(undefined, {
			hour: "numeric",
			minute: "numeric",
			month: "short",
			day: "numeric",
		})}
	*/
