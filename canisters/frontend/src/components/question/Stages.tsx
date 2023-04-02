import React from "react";
import { OnIcon, OngoingIcon, ClosedIcon } from "../core/Icons";

const Stages = ({ stage }) => {
	return (
		<div className="w-max flex gap-4 p-3 border-[1px] border-gray-100 rounded-full">
			<OnIcon
				fillColor={`${stage === "open" ? "#267DFF" : "#707072"}`}
				borderColor={`${stage === "open" ? "#ECFCFF" : "#F6F6F6"}`}
			/>

			<OngoingIcon
				borderColor={`${stage === "ongoing" ? "#267DFF" : "#707072"}`}
			/>
			<ClosedIcon
				borderColor={`${stage === "closed" ? "#267DFF" : "#707072"}`}
			/>
		</div>
	);
};

export default Stages;
