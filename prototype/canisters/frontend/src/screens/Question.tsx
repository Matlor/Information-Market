import { useState, useEffect } from "react";
import { useParams } from "react-router";

import ListWrapper from "../components/core/view/ListWrapper";
import AnswerWrapper from "../components/question/view/AnswerWrapper";
import QuestionBody from "../components/question/view/QuestionBody";
import SlateSubmit from "../components/question/view/SlateSubmit";

import sudograph from "../components/core/services/sudograph";

import StatusIndicator from "../components/question/view/StatusIndicator";
import StatusWrapper from "../components/question/view/StatusWrapper";

const Question = ({ plug }) => {
	let { id } = useParams();

	// answer state
	const [answerInput, setAnswerInput] = useState<any>("");
	const [questionState, setQuestionState] = useState<any>({
		question: {},
		hasData: false,
		answers: [],
	});

	const [pickedWinnerId, setWinnerId] = useState<any>("");

	useEffect(() => {
		fetch_data();
	}, []);

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

	const submitAnswer = async () => {
		try {
			const res = await plug.actors.marketActor.answer_question(
				questionState.question.id,
				answerInput
			);

			if (res.err) {
				console.log(res.err);
			} else {
				await fetch_data();
			}
		} catch (e) {
			console.log(e);
		}
	};

	const submitWinner = async () => {
		try {
			const res = await plug.actors.marketActor.pick_winner(
				questionState.question.id,
				pickedWinnerId
			);

			if (res.err) {
			} else {
				await fetch_data();
			}
		} catch (e) {
			console.log(e);
		}
	};

	if (!questionState.hasData) {
		return <div>Loading...</div>;
	}

	const submitDispute = async () => {
		try {
			const res = await plug.actors.marketActor.trigger_dispute(
				questionState.question.id
			);

			if (res.err) {
			} else {
				await fetch_data();
			}
		} catch (e) {
			console.log(e);
		}
	};

	const isAnswerAuthor = () => {
		for (var i = 0; i < questionState.answers.length; i++) {
			if (questionState.answers[i].author.id === plug.principal) {
				return true;
			} else {
				return false;
			}
		}
	};
	var currentUserRole = "none";
	if (questionState.question.author.id === plug.principal) {
		currentUserRole = "questionAuthor";
	} else if (isAnswerAuthor()) {
		currentUserRole = "answerAuthor";
	}

	return (
		<ListWrapper>
			<div className="flex gap-[17px]">
				<StatusIndicator status={questionState.question.status} />
				<StatusWrapper
					currentStatus={questionState.question.status}
					currentUserRole={currentUserRole}
					pickedWinnerId={pickedWinnerId}
					submitWinner={submitWinner}
					submitDispute={submitDispute}
					winnerByChoice={questionState.question.winner}
				/>
			</div>

			<QuestionBody
				reward={questionState.question.reward}
				title={questionState.question.title}
				content={questionState.question.content}
				authorName={questionState.question.author.name}
				numberOfAnswers={questionState.answers.length}
				date={questionState.question.creation_date}
			/>

			<SlateSubmit
				currentStatus={questionState.question.status}
				currentUserRole={currentUserRole}
				slateInput={answerInput}
				setSlateInput={setAnswerInput}
				propFunction={submitAnswer}
				isLoggedIn={plug.isConnected}
			/>

			{questionState.answers.map((answer: any) => {
				return (
					<AnswerWrapper
						key={answer.id}
						currentStatus={questionState.question.status}
						currentUserRole={currentUserRole}
						answer={answer}
						pickedWinnerId={pickedWinnerId}
						setWinnerId={setWinnerId}
						winnerByChoice={questionState.question.winner}
						finalWinner={questionState.question.winner}
					/>
				);
			})}
		</ListWrapper>
	);
};

export default Question;
