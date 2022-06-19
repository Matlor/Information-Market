import { useState } from "react";
import Answer from "./Answer";
import FieldWrapper from "../helperComponents/FieldWrapper";
import CallStateHandler from "../helperComponents/CallStateHandler";

import SlateEditor from "../SlateEditor";

const Open = ({
	questionState,
	plug,
	fetch_data,
	login,
	cachedAvatars,
	loadAvatar,
}: any) => {
	const [answerInput, setAnswerInput] = useState<any>("");

	const [callState, setCallState] = useState<any>({
		loading: false,
		error: false,
	});

	const submitAnswer = async (e: any) => {
		e.preventDefault();

		setCallState({
			loading: true,
			error: false,
		});
		try {
			// has to be logged in
			const res = await plug.actors.marketActor.answer_question(
				questionState.question.id,
				answerInput
			);
			if (res.err) {
				setCallState({
					loading: false,
					error: true,
				});
			} else {
				setCallState({
					loading: false,
					error: false,
				});
				await fetch_data();
			}
		} catch (e) {
			setCallState({
				loading: false,
				error: true,
			});
			console.log(e);
		}
	};

	const loginHandler = async (e: any) => {
		e.preventDefault();
		login();
	};

	return (
		<>
			<FieldWrapper>
				<form onSubmit={submitAnswer} className="w-full">
					<SlateEditor
						inputValue={answerInput}
						setInputValue={setAnswerInput}
						placeholder={"Write your answer here!"}
					/>

					{plug.isConnected ? (
						plug.plug.principalId == questionState.question.author.id ? (
							<div>You cannot answer your own question</div>
						) : (
							<div className="w-fit">
								<button type="submit" className="my-button mb-2">
									Submit
								</button>
								<CallStateHandler
									loading={callState.loading}
									err={callState.error}
									errMsg={"Something went wrong"}
								/>
							</div>
						)
					) : (
						<div className="font-light flex ">
							<button onClick={loginHandler} className="my-button">
								Log in
							</button>
							<div className="self-center ml-2 ">
								{" "}
								You have to be logged in to answer{" "}
							</div>
						</div>
					)}
				</form>
			</FieldWrapper>

			{questionState.answers.map((answer: any, index: number) => {
				return (
					<Answer
						plug={plug}
						answer={answer}
						key={answer.id}
						questionState={questionState}
						cachedAvatars={cachedAvatars}
						loadAvatar={loadAvatar}
					/>
				);
			})}
		</>
	);
};

export default Open;
