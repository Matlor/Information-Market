import React from "react";
import Loading from "../core/Loading";

export type SubmitStages =
	| ""
	| "invoice"
	| "transfer"
	| "submit"
	| "success"
	| "error";

type loader = "empty" | "loading" | "filled";

const valuesPerSubmitStage = (
	stages: SubmitStages
): { style: [loader, loader, loader]; text: string } => {
	switch (stages) {
		case "":
			return { style: ["empty", "empty", "empty"], text: "" };
		case "invoice":
			return {
				style: ["loading", "empty", "empty"],
				text: "Waiting for invoice",
			};
		case "transfer":
			return {
				style: ["filled", "loading", "empty"],
				text: "Transfer Ongoing",
			};
		case "submit":
			return {
				style: ["filled", "filled", "loading"],
				text: "Opening Question",
			};
		case "success":
			return {
				style: ["filled", "filled", "filled"],
				text: "Success!",
			};
		case "error":
			return {
				style: ["empty", "empty", "empty"],
				text: "Something went wrong",
			};
		default:
			return { style: ["empty", "empty", "empty"], text: "" };
	}
};

export const SubmitStages = ({ stages }) => {
	return (
		<div className="flex gap-[17px]">
			<Loading color="" style={valuesPerSubmitStage(stages).style[0]} />
			<Loading color="" style={valuesPerSubmitStage(stages).style[1]} />
			<Loading color="" style={valuesPerSubmitStage(stages).style[2]} />
		</div>
	);
};

export const SubmitStagesText = ({ stages }) => {
	return (
		<div className={`${stages === "error" ? "" : ""}  ml-4`}>
			{valuesPerSubmitStage(stages).text}
		</div>
	);
};
