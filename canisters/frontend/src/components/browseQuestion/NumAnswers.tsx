import React from "react";
import { AnswersIcon } from "../core/Icons";

const NumAnswers = ({ number }: { number: number }) => {
	return (
		<div className="flex gap-1 items-center">
			<div className="scale-125 mt-[2px]">
				<AnswersIcon />
			</div>
			<div className="text-small-number">{number}</div>
		</div>
	);
};

export default NumAnswers;
