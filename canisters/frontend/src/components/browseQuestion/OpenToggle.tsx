import React from "react";
import { OnStage } from "../question/Stages";

const OpenToggle = ({ isOn = false, onClick, className = "" }) => {
	return (
		<div onClick={onClick} className={`cursor-pointer ${className}`}>
			<OnStage isActive={isOn} />
		</div>
	);
};

export default OpenToggle;
