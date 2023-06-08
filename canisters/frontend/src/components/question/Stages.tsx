import React from "react";
import { OngoingIcon, ClosedIcon } from "../core/Icons";

/* 
These would be the desired colors
	/* const stageColorMapping = {
		before: "#DCDCDC",
		active: "#F42C00",
		after: "#EEEEEC",
	}; 
*/
const stageColorMapping = {
	before: "gray-300",
	active: "red",
	after: "black",
};

const Stages = ({ stage }) => {
	let stageNumber;
	if (stage === "open") {
		stageNumber = 0;
	} else if (stage === "ongoing") {
		stageNumber = 1;
	} else {
		stageNumber = 2;
	}

	return (
		<div className="flex items-center gap-2 rounded-full w-max">
			<div className=" border-1 border-gray-500 border-dotted h-[32px] w-[32px] flex justify-center items-center">
				<OnStage isActive={stageNumber === 0} />
			</div>
			<div className=" border-1 border-gray-500 border-dotted h-[32px] w-[32px] flex justify-center items-center">
				<OngoingStage stage={stageNumber} />
			</div>
			<div className=" border-1 border-gray-500 border-dotted h-[32px] w-[32px] flex justify-center items-center">
				<ClosedStage stage={stageNumber} />
			</div>
		</div>
	);
};

const OnStage = ({ isActive, size = 24 }) => {
	return (
		<div
			style={{
				position: "relative",
				width: `${size}px`,
				height: `${size}px`,
				zIndex: "1",
			}}
		>
			{isActive && (
				<div
					style={{
						position: "absolute",
						width: "100%",
						height: "100%",
						borderRadius: "50%",
						backgroundColor: "#F3D6D1",
						animation: "pulse 2s infinite",
						top: "0",
						left: "0",
					}}
				></div>
			)}

			<div
				style={{
					position: "absolute",
					top: "50%",
					left: "50%",
					width: "50%",
					height: "50%",
					backgroundColor: isActive ? "#EB5C42" : "black",
					borderRadius: "50%",
					transform: "translate(-50%, -50%)",
				}}
			></div>
		</div>
	);
};

const OngoingStage = ({ stage }) => {
	let activeStage = 1;

	let color;
	if (stage === activeStage) {
		color = stageColorMapping.active;
	} else if (stage < activeStage) {
		color = stageColorMapping.before;
	} else {
		color = stageColorMapping.after;
	}
	return <OngoingIcon borderColor={`${color}`} strokeWidth={1.5} size={14} />;
};

const ClosedStage = ({ stage }) => {
	let activeStage = 2;

	let color = "white";
	if (stage < activeStage) {
		color = stageColorMapping.before;
	} else {
		color = stageColorMapping.after;
	}

	return (
		<div className={`rounded-full border-[1px] border-${color}`}>
			<ClosedIcon borderColor={`${color}`} strokeWidth={1.5} size={14} />
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
