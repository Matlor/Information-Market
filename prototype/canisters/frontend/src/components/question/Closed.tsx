import { useState } from "react";
import Answer from "./Answer";

/* 
    Payout
    - field shows winner
    - mapping shows visual indication of who won
*/

const Closed = ({ questionState }: any) => {
	return (
		<>
			<div>Closed</div>
			<div className=" p-2">
				{questionState.answers.map((answer: any) => {
					return <Answer answer={answer} key={answer.id} />;
				})}
			</div>
		</>
	);
};

export default Closed;
