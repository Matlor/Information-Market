import { useState } from "react";

// to do: time left
const StatusIndicator = ({ status }) => {
	const statusToStatusText = () => {
		switch (status) {
			case "OPEN":
				return "Open (1/5)";
			case "PICKANSWER":
				return "Winner Selection (2/5)";
			case "DISPUTABLE":
				return "Dispute (3/5)";
			case "DISPUTED":
				return "Arbitration (4/5)";
			case "CLOSED":
				return "Payout (5/5)";

			default:
				return "Can't determine status";
		}
	};

	return (
		<div className="flex flex-col gap-[22px] w-[326px] py-[30px] px-[60px] rounded-md shadow-md bg-colorBackgroundComponents">
			<div className="heading3-18px">{statusToStatusText()}</div>
			<div className="flex flex-col items-start">
				<div className="text-small-12px">Time Left</div>
				<div className="heading3-18px">03:20</div>
			</div>
		</div>
	);
};

export default StatusIndicator;
