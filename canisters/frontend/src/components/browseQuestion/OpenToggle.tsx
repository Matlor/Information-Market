import React from "react";
import { OnIcon } from "../core/Icons";

const OpenToggle = ({ isOn = false, toggleStatus }) => {
	return (
		<div onClick={toggleStatus} className="flex items-center gap-1">
			<OnIcon
				fillColor={`${isOn ? "#267DFF" : "#707072"}`}
				borderColor={`${isOn ? "#ECFCFF" : "#F6F6F6"}`}
			/>
			<div className="text-md">Open</div>
		</div>
	);
};

export default OpenToggle;
