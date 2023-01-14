import React from "react";

import { graphQlToStrDate } from "./utils/conversions";
import { IconDate } from "./Icons";

interface IDate {
	date: number;
	text?: string;
}

const Date = ({ date, text = "text-small" }: IDate) => {
	return (
		<div className={`flex gap-[12px] ${text} items-center`}>
			<IconDate />
			<div className="w-max">{graphQlToStrDate(date)}</div>
		</div>
	);
};

export default Date;
