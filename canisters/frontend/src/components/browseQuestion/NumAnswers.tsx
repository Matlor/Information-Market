import React from "react";
import { AnswerIcon } from "../core/Icons";

const NumAnswers = ({ number }: { number: number }) => {
	return (
		<div className="flex items-center gap-1">
			<div className="-mb-[0.5px]">
				<AnswerIcon size={12} fillColor="transparent" borderColor="gray-500" />
			</div>
			<div className="ml-1 text-extra-small font-300"> {number} Answers</div>
		</div>
	);
};

export default NumAnswers;
