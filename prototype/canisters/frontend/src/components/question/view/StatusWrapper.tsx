import Indication from "./status/Indication";
import Closed from "./status/Closed";
import ButtonProfile from "./status/ButtonProfile";

import { checkIfCaseTrue } from "../services/cases";

const StatusWrapper = ({
	currentStatus,
	currentUserRole,
	pickedWinnerId,
	submitWinner,
	submitDispute,
	winnerByChoice,
}) => {
	if (
		checkIfCaseTrue("OPEN", "answerAuthor", currentStatus, currentUserRole) ||
		checkIfCaseTrue("OPEN", "none", currentStatus, currentUserRole)
	) {
		return <Indication text={"Answer the question to win the reward"} />;
	} else if (
		checkIfCaseTrue("OPEN", "questionAuthor", currentStatus, currentUserRole)
	) {
		return <Indication text={"Others can now answer your question"} />;
	} else if (
		checkIfCaseTrue(
			"PICKANSWER",
			"answerAuthor",
			currentStatus,
			currentUserRole
		) ||
		checkIfCaseTrue("PICKANSWER", "none", currentStatus, currentUserRole)
	) {
		return (
			<Indication text={"A winner is being picked by the question author"} />
		);
	} else if (
		checkIfCaseTrue(
			"PICKANSWER",
			"questionOwner",
			currentStatus,
			currentUserRole
		)
	) {
		return (
			<ButtonProfile
				text={`The winner you have selected: ${pickedWinnerId}`}
				toCall={submitWinner}
				userName={"improve"}
			/>
		);
	} else if (
		checkIfCaseTrue(
			"DISPUTABLE",
			"questionOwner",
			currentStatus,
			currentUserRole
		) ||
		checkIfCaseTrue("DISPUTABLE", "none", currentStatus, currentUserRole)
	) {
		return (
			<Indication
				text={`The following user was picked as winner. The choice can be disputed ${winnerByChoice.id}`}
			/>
		);
	} else if (
		checkIfCaseTrue(
			"DISPUTABLE",
			"answerAuthor",
			currentStatus,
			currentUserRole
		)
	) {
		return (
			<ButtonProfile
				text={`The following user was picked as winner. The choice can be disputed ${winnerByChoice.id}`}
				toCall={submitDispute}
				userName={winnerByChoice.author.name}
			/>
		);
	} else if (
		checkIfCaseTrue("DISPUTED", "any", currentStatus, currentUserRole)
	) {
		return <Indication text={"Arbitration is ongoing by the size owners"} />;
	} else if (checkIfCaseTrue("CLOSED", "any", currentStatus, currentUserRole)) {
		return <Closed />;
	}
};

export default StatusWrapper;
