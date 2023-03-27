import React from "react";
import { AnswersIcon } from "../core/Icons";

const NumAnswers = ({ number }: { number: number }) => {
	return (
		<div className="flex gap-2 items-center">
			<div className="mt-[3px]">
				<AnswersIcon size={16} />
			</div>
			<div className="text-small-number">{number}</div>
		</div>
	);
};

export default NumAnswers;
