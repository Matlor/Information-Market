import React from "react";
import Loading from "../core/Loading";
import { SubmitStages } from "../../screens/AddQuestion";

const getStyles = (stages: SubmitStages) => {
	switch (stages) {
		case "invoice":
			return ["loading", "empty", "empty"];
		case "transfer":
			return ["filled", "loading", "empty"];
		case "submit":
			return ["filled", "filled", "loading"];
		case "success":
			return ["filled", "filled", "filled"];
	}
};

const getText = (stages) => {
	switch (stages) {
		case "invoice":
			return "Waiting for invoice";
		case "transfer":
			return "Transfer Ongoing";
		case "submit":
			return "Opening Question";
		case "success":
			return "Success!";
		default:
			return "";
	}
};

export const ShowStages = ({ stages }) => {
	return (
		<div className="flex gap-4">
			<Loading style={getStyles(stages)[0]} />
			<Loading style={getStyles(stages)[1]} />
			<Loading style={getStyles(stages)[2]} />
		</div>
	);
};

export const SubmitStagesText = ({ stages }) => {
	return <div className={`text-small `}>{getText(stages)}</div>;
};
