import { useState } from "react";
import Answer from "./Answer";
import FieldWrapper from "../layout/FieldWrapper";

const Open = ({ questionState, plug, fetch_data, login }: any) => {
	const [answerInput, setAnswerInput] = useState<any>("");

	const submitAnswer = async (e: any) => {
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
			<FieldWrapper>
				<form onSubmit={submitAnswer} className="w-full">
					<textarea
						className="h-36 mb-2 p-2.5 bg-primary border-0 w-full"
						value={answerInput}
						onChange={(e) => {
							setAnswerInput(e.target.value);
						}}
					/>

					{plug.isConnected ? (
						<button type="submit" className="my-button ">
							Submit
						</button>
					) : (
						<div className="font-light flex ">
							<button onClick={loginHandler} className="my-button">
								log in
							</button>
							<div className="self-center ml-2 italic">
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
					/>
				);
			})}
		</>
	);
};

export default Open;
