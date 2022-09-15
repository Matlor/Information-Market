import { useState, useEffect } from "react";
import { useParams } from "react-router";

import ListWrapper from "../components/core/view/ListWrapper";
import AnswerWrapper from "../components/question/view/AnswerWrapper";
import QuestionBody from "../components/question/view/QuestionBody";
import SlateSubmit from "../components/question/view/SlateSubmit";

import sudograph from "../components/core/services/sudograph";

import StatusIndicator from "../components/question/view/StatusIndicator";
import StatusWrapper from "../components/question/view/StatusWrapper";
import { blobToBase64Str } from "../components/core/services/utils/conversions";

import Loading from "../components/core/view/Loading";

const Question = ({
	isConnected,
	answerQuestion,
	pickWinner,
	triggerDispute,
	userPrincipal,
}: any) => {
	let { id } = useParams();

	const [answerInput, setAnswerInput] = useState<any>("");
	const [questionState, setQuestionState] = useState<any>({
		hasData: false,
		question: {},
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
					sortedAnswers = readAnswer.sort((a: any, b: any) => {
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

	/* FETCHING AVATARS */
	const [cachedAvatars, setCachedAvatars] = useState<any>(() => new Map());
	useEffect(() => {
		const loadAvatars = async function (
			questionState: any,
			cachedAvatars: any,
			setCachedAvatars: any
		) {
			if (!questionState.hasData) {
				return;
			}
			try {
				if (!cachedAvatars.has(questionState.question.author.id)) {
					const res = await sudograph.query_avatar(
						questionState.question.author.id
					);
					const loadedAvatar = blobToBase64Str(res.data.readUser[0].avatar);
					setCachedAvatars(
						(prev: any) =>
							new Map([
								...prev,
								[questionState.question.author.id, loadedAvatar],
							])
					);
				}
				for (var j = 0; j < questionState.answers.length; j++) {
					let answer: any = questionState.answers[j];
					if (!cachedAvatars.has(answer.author.id)) {
						const res = await sudograph.query_avatar(answer.author.id);
						const loadedAvatar = blobToBase64Str(res.data.readUser[0].avatar);
						setCachedAvatars(
							(prev: any) =>
								new Map([...prev, [answer.author.id, loadedAvatar]])
						);
					}
				}
			} catch (error) {
				console.error("Failed to load avatars!");
			}
		};
		loadAvatars(questionState, cachedAvatars, setCachedAvatars);
	}, [questionState]);

	const submitAnswer = async () => {
		try {
			const res = await answerQuestion(questionState.question.id, answerInput);

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
			const res = await pickWinner(questionState.question.id, pickedWinnerId);

			if (res.err) {
			} else {
				await fetch_data();
			}
		} catch (e) {
			console.log(e);
		}
	};

	const submitDispute = async () => {
		try {
			const res = await triggerDispute(questionState.question.id);

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
			if (questionState.answers[i].author.id === userPrincipal) {
				return true;
			} else {
				return false;
			}
		}
	};
	if (!questionState.hasData) {
		return (
			<div className="mt-[103px]">
				<Loading />
			</div>
		);
	}

	var currentUserRole = "none";
	if (questionState.question.author.id === userPrincipal) {
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
				avatar={cachedAvatars.get(questionState.question.author.id)}
				numberOfAnswers={questionState.answers.length}
				date={questionState.question.creation_date}
			/>

			<SlateSubmit
				currentStatus={questionState.question.status}
				currentUserRole={currentUserRole}
				slateInput={answerInput}
				setSlateInput={setAnswerInput}
				propFunction={submitAnswer}
				isLoggedIn={isConnected}
			/>

			{questionState.answers.map((answer: any) => {
				return (
					<AnswerWrapper
						key={answer.id}
						currentStatus={questionState.question.status}
						currentUserRole={currentUserRole}
						answer={answer}
						avatar={cachedAvatars.get(answer.author.id)}
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
