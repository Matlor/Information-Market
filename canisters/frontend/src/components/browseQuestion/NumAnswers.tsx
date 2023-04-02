import React from "react";
import { AnswerIcon } from "../core/Icons";

const NumAnswers = ({ number }: { number: number }) => {
	return (
		<div className="flex items-center gap-1">
			<AnswerIcon size={16} />
			<div className="">{number}</div>
		</div>
	);
};

export default NumAnswers;
