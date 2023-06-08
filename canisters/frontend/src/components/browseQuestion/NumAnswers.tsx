import React from "react";
import { AnswerIcon } from "../core/Icons";

const NumAnswers = ({ number }: { number: number }) => {
	return (
		<div className="flex items-center gap-[2px]">
			<div className="text-gray-400  text-extra-small font-400">{number}</div>
			<div className="-mb-[0.5px] ">
				<AnswerIcon
					size={11}
					fillColor="white"
					strokeWidth={1.5}
					borderColor="gray-400"
				/>
			</div>
		</div>
	);
};

export default NumAnswers;
