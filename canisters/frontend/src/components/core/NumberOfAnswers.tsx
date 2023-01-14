import React from "react";
import { IconAnswers } from "./Icons";

const NumberOfAnswers = ({ answers }: { answers: number }) => {
	return (
		<div className="flex justify-center items-center gap-2.5 w-max">
			<IconAnswers />
			<div className="text-small">{answers} answers</div>
		</div>
	);
};

export default NumberOfAnswers;
