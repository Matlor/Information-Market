import { useState } from "react";
import Answer from "./Answer";

const Open = ({ questionState, plug, fetch_data, login }: any) => {
	const [answerInput, setAnswerInput] = useState<any>("");

	const submitAnswer = async (e: any) => {
		console.log(questionState.question.id, "id");
		e.preventDefault();
		// has to be logged in
		console.log(
			await plug.actors.marketActor.answer_question(
				questionState.question.id,
				answerInput
			)
		);
		await fetch_data();
	};

	const loginHandler = async (e: any) => {
		e.preventDefault();
		login();
	};

	return (
		<>
			<form onSubmit={submitAnswer}>
				<textarea
					className="h-32 mb-2 p-2.5 bg-primary border  block w-full "
					value={answerInput}
					onChange={(e) => {
						setAnswerInput(e.target.value);
					}}
				/>

				{plug.isConnected ? (
					<button type="submit" className="my-button">
						Submit
					</button>
				) : (
					<div className="font-light flex">
						<button onClick={loginHandler} className="my-button">
							log in
						</button>
						<div className="self-center ml-2">
							{" "}
							You have to be logged in to answer{" "}
						</div>
					</div>
				)}
			</form>
			<div>
				{questionState.answers.map((answer: any, index: number) => {
					return (
						<Answer
							plug={plug}
							answer={answer}
							key={answer.id}
							questionState={questionState}
						/>
					);
				})}
			</div>
		</>
	);
};

export default Open;
