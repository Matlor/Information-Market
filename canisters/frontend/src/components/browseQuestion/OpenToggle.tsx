import React from "react";
import { OnStage } from "../question/Stages";

const OpenToggle = ({ isOn = false, onClick }) => {
	return (
		<div onClick={onClick} className="flex items-center gap-3 cursor-pointer">
			<OnStage isActive={isOn} />
			<div className="text-gray-500 font-300 text-large">Open</div>
		</div>
	);
};

export default OpenToggle;

/* 
fillColor={`${isOn ? "accent-200" : "gray-100"} `}
				borderColor={`${isOn ? "accent-400" : "gray-500"}`}
*/
