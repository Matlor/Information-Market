import Answer from "./Answer";

import { checkIfCaseTrue } from "../services/cases";

const AnswerWrapper = ({
	currentStatus,
	currentUserRole,
	answer,
	avatar,
	pickedWinnerId,
	setWinnerId,
	winnerByChoice,
	finalWinner,
}: any) => {
	if (checkIfCaseTrue("OPEN", "any", currentStatus, currentUserRole)) {
		return (
			<Answer
				content={answer.content}
				date={answer.creation_date}
				authorName={answer.author.name}
				avatar={avatar}
			/>
		);
	} else if (
		checkIfCaseTrue(
			"PICKANSWER",
			"questionAuthor",
			currentStatus,
			currentUserRole
		)
	) {
		return (
			<div onClick={() => setWinnerId(answer.id)}>
				<Answer
					content={answer.content}
					date={answer.creation_date}
					authorName={answer.author.name}
					avatar={avatar}
					isChoice={pickedWinnerId === answer.id}
					choiceBorder={"border-2 border-colorLines"}
					isHover={true}
					hoverBorder={
						"hover:hover:border-colorLines border-2 border-colorBackgroundComponents"
					}
				/>
			</div>
		);
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
			<Answer
				content={answer.content}
				date={answer.creation_date}
				authorName={answer.author.name}
				avatar={avatar}
			/>
		);
	} else if (
		checkIfCaseTrue("DISPUTABLE", "any", currentStatus, currentUserRole)
	) {
		// TODO: Add who the picked winner actually was
		return (
			<Answer
				content={answer.content}
				date={answer.creation_date}
				authorName={answer.author.name}
				avatar={avatar}
				isChoice={winnerByChoice.id === answer.id}
				choiceBorder={"border-2 border-colorLines"}
				isHover={false}
				hoverBorder={
					"hover:hover:border-colorLines border-2 border-colorBackgroundComponents"
				}
			/>
		);
	} else if (
		checkIfCaseTrue("DISPUTED", "any", currentStatus, currentUserRole)
	) {
		return (
			<Answer
				content={answer.content}
				date={answer.creation_date}
				authorName={answer.author.name}
				avatar={avatar}
			/>
		);
	} else if (checkIfCaseTrue("CLOSED", "any", currentStatus, currentUserRole)) {
		return (
			<Answer
				content={answer.content}
				date={answer.creation_date}
				authorName={answer.author.name}
				avatar={avatar}
				isChoice={finalWinner.id === answer.id}
				choiceBorder={"border-2 border-colorLines"}
				isHover={false}
				hoverBorder={
					"hover:hover:border-colorLines border-2 border-colorBackgroundComponents"
				}
			/>
		);
	} else {
		return (
			<Answer
				content={answer.content}
				date={answer.creation_date}
				authorName={answer.author.name}
				avatar={avatar}
			/>
		);
	}
};

export default AnswerWrapper;
