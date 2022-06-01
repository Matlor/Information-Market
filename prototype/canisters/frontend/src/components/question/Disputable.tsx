import { useState } from "react";
import Answer from "./Answer";

/* 
    Disputable
    - In field it shows a button to dispute if you are logged in an answerer
    - shows in list of questions an indication who was the winner
    - deals with the case that no winner has been selected
    - deals with the case that user might not have given answer (either not showing button or dealing with error)

    - I'm not checking if winner exists right now

*/

const Disputable = ({ questionState, plug, fetch_data, login }: any) => {
	const handleTriggerDispute = async (e) => {
		e.preventDefault();
		console.log(
			await plug.actors.marketActor.trigger_dispute(questionState.question.id)
		);
	};

	// I could handle that logic with the dispute in a function
	return (
		<>
			<div className="border mt-4 mb-4">
				<div className="font-light">
					{questionState.question.winner ? (
						<div className=" flex justify-between  items-center">
							<div className="">Winner: {questionState.question.winner.id}</div>
							<div>
								{" "}
								{plug.isConnected ? (
									<button
										onClick={(e) => handleTriggerDispute(e)}
										className="px-6 py-2  cursor-pointer bg-slate-50 rounded-full font-light"
									>
										{" "}
										dispute
									</button>
								) : (
									<div> Log in to dispute</div>
								)}
							</div>
						</div>
					) : (
						<div> Winner: No winner has been picked</div>
					)}
				</div>
			</div>
			<div className=" p-2">
				{questionState.answers.map((answer: any) => {
					var border = "";
					const borderWinningAnswer = () => {
						if (answer.id === questionState.question.winner.id) {
							border = "border-yellow-500 border";
						}
					};
					borderWinningAnswer();

					return (
						<div className={`${border} `}>
							<Answer answer={answer} key={answer.id} />{" "}
						</div>
					);
				})}
			</div>
		</>
	);
};

export default Disputable;
