import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { blobToBase64Str } from "../components/core/services/utils/conversions";
import ListWrapper from "../components/core/view/ListWrapper";
import AnswerWrapper from "../components/question/view/AnswerWrapper";
import QuestionBody from "../components/question/view/QuestionBody";
import SlateSubmit from "../components/question/view/SlateSubmit";
import sudograph from "../components/core/services/sudograph";
import Loading from "../components/core/view/Loading";
import QuestionMenu from "../components/question/view/QuestionMenu";
import { e3sToIcp } from "../components/core/services/utils/conversions";

import { valueToStatus } from "../components/core/services/utils/conversions";

const Question = ({
	userPrincipal,
	answerQuestion,
	pickWinner,
	triggerDispute,
	createDefaultAvatar,
}: any) => {
	let { id } = useParams();

	const [answerInput, setAnswerInput] = useState<any>("");
	const [questionState, setQuestionState] = useState<any>({
		hasData: false,
		question: {},
		answers: [],
	});
	const [cachedAvatars, setCachedAvatars] = useState<any>(() => new Map());
	const [unsubmittedChoice, setUnsubmittedChoice] = useState<any>("");

	console.log(questionState);

	const loadAvatars = async (
		questionState: any,
		cachedAvatars: any,
		setCachedAvatars: any
	) => {
		if (!questionState.hasData) {
			return;
		}
		try {
			if (!cachedAvatars.has(questionState.question.author.id)) {
				const res = await sudograph.query_avatar(
					questionState.question.author.id
				);
				const loadedAvatar = res.data.readUser[0].avatar
					? await blobToBase64Str(res.data.readUser[0].avatar)
					: await createDefaultAvatar();
				setCachedAvatars(
					(prev: any) =>
						new Map([...prev, [questionState.question.author.id, loadedAvatar]])
				);
			}
			for (var j = 0; j < questionState.answers.length; j++) {
				let answer: any = questionState.answers[j];
				if (!cachedAvatars.has(answer.author.id)) {
					const res = await sudograph.query_avatar(answer.author.id);
					const loadedAvatar = res.data.readUser[0].avatar
						? await blobToBase64Str(res.data.readUser[0].avatar)
						: await createDefaultAvatar();
					setCachedAvatars(
						(prev: any) => new Map([...prev, [answer.author.id, loadedAvatar]])
					);
				}
			}
		} catch (error) {
			console.error(error, "Failed to load avatars!");
		}
	};

	const fetch_data = async () => {
		try {
			const {
				data: { readQuestion },
			} = await sudograph.get_question(id);

			if (readQuestion[0]) {
				var transformedData = readQuestion[0];
				transformedData.reward = e3sToIcp(readQuestion[0].reward);
				transformedData.status = valueToStatus(readQuestion[0].status);
			}

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
					question: transformedData,
					hasData: true,
					answers: sortedAnswers,
				});

				await loadAvatars(
					{
						question: transformedData,
						hasData: true,
						answers: sortedAnswers,
					},
					cachedAvatars,
					setCachedAvatars
				);
			}
		} catch (err) {
			console.debug(err);
		}
	};

	useEffect(() => {
		var interval: any;
		if (!interval) {
			fetch_data();
		}
		interval = setInterval(() => {
			fetch_data();
		}, 5000);
		return () => clearInterval(interval);
	}, []);

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
			const res = await pickWinner(
				questionState.question.id,
				unsubmittedChoice.id
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

	const submitDispute = async () => {
		try {
			const res = await triggerDispute(questionState.question.id);
			if (res.err) {
				console.log(res.err);
			} else {
				await fetch_data();
			}
		} catch (e) {
			console.log(e);
		}
	};

	if (!questionState.hasData) {
		return (
			<div className="mt-[78px]">
				<Loading />
			</div>
		);
	}

	const isAnswerAuthor = () => {
		for (let i = 0; i < questionState.question.answers.length; i++) {
			if (questionState.question.answers[i].author.id === userPrincipal) {
				return true;
			}
		}
		return false;
	};

	var currentUserRole = "isNone";
	if (questionState.question.author.id === userPrincipal) {
		currentUserRole = "isQuestionAuthor";
	} else if (isAnswerAuthor()) {
		currentUserRole = "isAnswerAuthor";
	} else if (userPrincipal === "") {
		currentUserRole = "isNotLoggedIn";
	}

	return (
		<ListWrapper>
			<QuestionMenu
				currentStatus={questionState.question.status}
				currentUserRole={currentUserRole}
				unsubmittedChoice={unsubmittedChoice}
				submitWinner={submitWinner}
				winner={questionState.question.winner}
				submitDispute={submitDispute}
				cachedAvatars={cachedAvatars}
			/>
			<QuestionBody
				status={questionState.question.status}
				endDateSec={questionState.question.status_end_date * 60}
				reward={questionState.question.reward}
				title={questionState.question.title}
				content={questionState.question.content}
				initiator={questionState.question.author}
				avatar={cachedAvatars.get(questionState.question.author.id)}
				cachedAvatars={cachedAvatars}
				numberOfAnswers={questionState.answers.length}
				date={questionState.question.creation_date}
				winner={questionState.question.winner}
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
				unsubmittedChoice={
					unsubmittedChoice && unsubmittedChoice.id ? unsubmittedChoice.id : ""
				}
				setUnsubmittedChoice={setUnsubmittedChoice}
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
