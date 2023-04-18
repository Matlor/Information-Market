import React from "react";
import { OnIcon, OngoingIcon, ClosedIcon } from "../core/Icons";

const tailwind = ["bg-gray-100"];

// bg-[#426E86]
const onColor = "bg-[#426E86]";
const offColor = "bg-white";

const onBorderColor = "white";
const offBorderColor = "gray-500";
const Stages = ({ stage }) => {
	return (
		<div className="flex items-center gap-3 rounded-full w-max">
			<OnStage isActive={stage === "open"} />
			<OngoingStage isActive={stage === "ongoing"} />
			<ClosedStage isActive={stage === "closed"} />
		</div>
	);
};

const OnStage = ({ isActive }) => {
	return (
		<div
			className={`p-1 shadow-xl rounded-full ${isActive ? onColor : offColor} `}
		>
			<OnIcon
				borderColor={`${isActive ? onBorderColor : offBorderColor}`}
				size={12}
			/>
		</div>
	);
};

const OngoingStage = ({ isActive }) => {
	return (
		<div
			className={`p-1 shadow-xl rounded-full ${isActive ? onColor : offColor} `}
		>
			<OngoingIcon
				borderColor={`${isActive ? onBorderColor : offBorderColor}`}
				strokeWidth={1}
				size={12}
			/>
		</div>
	);
};

const ClosedStage = ({ isActive }) => {
	return (
		<div
			className={`p-1 shadow-xl rounded-full ${isActive ? onColor : offColor} `}
		>
			<ClosedIcon
				borderColor={`${isActive ? onBorderColor : offBorderColor}`}
				strokeWidth={1}
				size={12}
			/>
		</div>
	);
};

export default Stages;
export { OnStage, OngoingStage, ClosedStage };

/* 
return (
		<div className="flex items-center gap-2 rounded-full w-max">
			<div
				className={`p-1 bg-white rounded-full ${
					stage === "ongoing" ? "bg-accent-200" : "bg-gray-100"
				} `}
			>
				<OnIcon
					fillColor={`${stage === "open" ? "accent-200" : "gray-100"}`}
					borderColor={`${stage === "open" ? "accent-400" : "gray-800"}`}
				/>
			</div>
			<div
				className={`p-1 bg-white rounded-full ${
					stage === "ongoing" ? "bg-accent-200" : "bg-gray-100"
				} `}
			>
				<OngoingIcon
					borderColor={`${stage === "ongoing" ? "accent-400" : "gray-800"}`}
					strokeWidth={0.6}
					size={14}
				/>
			</div>
			<div
				className={`p-1 bg-white rounded-full ${
					stage === "closed" ? "bg-accent-200" : "bg-gray-100"
				} `}
			>
				<ClosedIcon
					borderColor={`${stage === "closed" ? "accent-400" : "gray-800"}`}
					strokeWidth={0.6}
					size={16}
				/>
			</div>
		</div>
	);


*/
