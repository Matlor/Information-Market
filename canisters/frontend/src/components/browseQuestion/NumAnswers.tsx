import React from "react";
import { AnswerIcon } from "../core/Icons";

const NumAnswers = ({ number }: { number: number }) => {
	return (
		<div className="flex items-center gap-1">
			<AnswerIcon size={13} fillColor="white" borderColor="gray-500" />
			<div className="text-extra-small">{number}</div>
		</div>
	);
};

export default NumAnswers;
