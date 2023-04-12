import React from "react";
import { OnIcon, OngoingIcon, ClosedIcon } from "../core/Icons";

const Stages = ({ stage }) => {
	return (
		//  border-[1px]
		<div className="flex gap-4 p-3 border-gray-100 w-max rounded-2">
			<OnIcon
				fillColor={`${stage === "open" ? "blue-500" : "gray-100"}`}
				borderColor={`${stage === "open" ? "blue-100" : "gray-500"}`}
			/>

			<OngoingIcon
				borderColor={`${stage === "ongoing" ? "blue-100" : "gray-500"}`}
			/>
			<ClosedIcon
				borderColor={`${stage === "closed" ? "blue-100" : "gray-500"}`}
			/>
		</div>
	);
};

export default Stages;
