import { useState } from "react";
import Answer from "./Answer";

/* 
    PickAnswer
    - Shows pick winner filed, which means once a winner is picked it shows it
        -> not does not even have that because the stage is immediately changed when selection happens
    - when logged in the map adds buttons to each question that allow to pick a winner
*/

const PickAnswer = ({ questionState, plug, fetch_data, login }: any) => {
	const handlePickWinner = async (e, answerId) => {
		e.preventDefault();
		console.log(
			await plug.actors.marketActor.pick_winner(
				questionState.question.id,
				answerId
			)
		);

		fetch_data();
	};

	return (
		<>
			<div className=" p-2">
				{questionState.answers.map((answer: any) => {
					return (
						<div key={answer.id}>
							<Answer answer={answer} />{" "}
							<div className="mt-2 mb-2 ">
								{plug.plug.principalId === questionState.question.author ? (
									<button
										className="px-6 py-2  cursor-pointer bg-slate-50 rounded-full "
										onClick={(e) => {
											handlePickWinner(e, answer.id);
										}}
									>
										{" "}
										Pick Winner
									</button>
								) : (
									<div></div>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</>
	);
};

export default PickAnswer;
