import React from "react";
import parse from "html-react-parser";
import Date from "../core/Date";

import { Answer as TAnswer } from "../../../declarations/market/market.did";

interface IAnswer {
	answer: TAnswer;
	children?: any;
}

const Answer = ({ children, answer }: IAnswer) => {
	return (
		<div
			className="flex flex-col gap-[5px] p-content rounded-lg bg-colorBackgroundComponents  text-justify"
			data-cy={`Answer-${answer.id}`}
		>
			<div className="text-justify editor-wrapper">{parse(answer.content)}</div>

			<div className="flex items-center self-stretch gap-[30px] pt-[35px] px-[0px] py-[0px]">
				<div>{children}</div>
				<Date date={answer.creation_date} />
			</div>
		</div>
	);
};

export default Answer;
