import React from "react";
import { OnIcon } from "../core/Icons";

const OpenToggle = ({ isOn = false, onClick }) => {
	return (
		<div onClick={onClick} className="flex items-center gap-2">
			<OnIcon
				fillColor={`${isOn ? "blue-500" : "gray-100"}`}
				borderColor={`${isOn ? "blue-100" : "gray-500"}`}
			/>
			<div className="text-large">Open</div>
		</div>
	);
};

export default OpenToggle;
