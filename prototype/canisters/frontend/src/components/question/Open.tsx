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
			<form onSubmit={submitAnswer} className="border mt-4 mb-4 p-4">
				<div className="mb-6">
					<textarea
						className="w-full h-32 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
						value={answerInput}
						onChange={(e) => {
							setAnswerInput(e.target.value);
						}}
					/>
				</div>
				{plug.isConnected ? (
					<button
						type="submit"
						className="font-light text-white bg-gray-400 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
					>
						Submit
					</button>
				) : (
					<div className="font-light ">
						<div> You have to be logged in to answer </div>

						<button
							onClick={loginHandler}
							className="px-6 py-2  cursor-pointer bg-slate-50 rounded-full"
						>
							log in
						</button>
					</div>
				)}
			</form>
			<div className=" p-2">
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
