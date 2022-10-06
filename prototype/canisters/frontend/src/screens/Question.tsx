import { useState, useEffect } from "react";
import { useParams } from "react-router";

import ListWrapper from "../components/core/view/ListWrapper";
import AnswerWrapper from "../components/question/view/AnswerWrapper";
import QuestionBody from "../components/question/view/QuestionBody";
import SlateSubmit from "../components/question/view/SlateSubmit";

import sudograph from "../components/core/services/sudograph";

import { blobToBase64Str } from "../components/core/services/utils/conversions";

import Loading from "../components/core/view/Loading";

import QuestionMenu from "../components/question/view/QuestionMenu";
import Title from "../components/question/view/Title";

const Question = ({
	userPrincipal,
	answerQuestion,
	pickWinner,
	triggerDispute,
}: any) => {
	let { id } = useParams();

	const [answerInput, setAnswerInput] = useState<any>("");
	const [questionState, setQuestionState] = useState<any>({
		hasData: false,
		question: {},
		answers: [],
	});

	console.log(questionState, "questionState");
	const [pickedWinner, setWinner] = useState<any>("");

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
			console.debug(err);
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
				console.error(error, "Failed to load avatars!");
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
			const res = await pickWinner(questionState.question.id, pickedWinner);
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
		for (var i = 0; i < questionState.question.answers.length; i++) {
			if (questionState.question.answers[i].author.id === userPrincipal) {
				return true;
			} else {
				return false;
			}
		}
	};
	if (!questionState.hasData) {
		return (
			<div className="mt-[78px]">
				<Loading />
			</div>
		);
	}

	var currentUserRole = "isNone";

	if (questionState.question.author.id === userPrincipal) {
		currentUserRole = "isQuestionAuthor";
	} else if (isAnswerAuthor()) {
		currentUserRole = "isAnswerAuthor";
	} else if (userPrincipal === "") {
		currentUserRole = "isNotLoggedIn";
	}

	// TODO: Final Winner might be assumed to be of wrong structure
	return (
		<ListWrapper>
			<Title
				currentStatus={questionState.question.status}
				currentUserRole={currentUserRole}
				pickedWinner={pickedWinner}
			/>
			<QuestionMenu
				currentStatus={questionState.question.status}
				currentUserRole={currentUserRole}
				timeLeftMin={questionState.question.status_end_date}
				reward={questionState.question.reward}
				pickedWinner={pickedWinner}
				submitWinner={submitWinner}
				submitDispute={submitDispute}
				finalWinner={questionState.question.winner}
			/>
			<QuestionBody
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
			/>

			<AnswerWrapper
				answers={questionState.answers}
				currentStatus={questionState.question.status}
				currentUserRole={currentUserRole}
				cachedAvatars={cachedAvatars}
				pickedWinnerId={pickedWinner && pickedWinner.id ? pickedWinner.id : ""}
				setWinner={setWinner}
				winnerByChoiceId={
					questionState.question.winner ? questionState.question.winner.id : ""
				}
				finalWinnerId={
					questionState.question.winner ? questionState.question.winner.id : ""
				}
			/>
		</ListWrapper>
	);
};

export default Question;
