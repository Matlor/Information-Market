import { useState } from "react";
import Answer from "./Answer";

/* 
    Arbitration
    - simply shows that works is in progress
    - show questions
*/

const Arbitration = ({ questionState }: any) => {
	return (
		<>
			<div className="border mt-2 mb-2">Arbitration in progress</div>
			<div className=" p-2">
				{questionState.answers.map((answer: any) => {
					return <Answer answer={answer} key={answer.id} />;
				})}
			</div>
		</>
	);
};

export default Arbitration;
