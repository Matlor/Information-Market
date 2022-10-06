const Title = ({ currentStatus, currentUserRole, pickedWinner }) => {
	const currentCase = currentStatus + "." + currentUserRole;
	const TitleWrapper = (title, subTitle) => {
		return (
			<div className="flex flex-col gap-[12px] pb-[11px]" data-cy="Title">
				<div className="heading-question-menu">{title}</div>
				<div className="heading-light">{subTitle}</div>
			</div>
		);
	};

	const PickAnswer_Question = (pickedWinner) => {
		if (!pickedWinner) {
			return TitleWrapper("Winner Selection 2/5", "Select a Winner");
		} else {
			return TitleWrapper("Winner Selection 2/5", "Confirm your Choice");
		}
	};

	switch (currentCase) {
		case "OPEN.isQuestionAuthor":
			return TitleWrapper(
				"Open 1/5",
				"Other Users can now Answer your Question"
			);
		case "OPEN.isAnswerAuthor":
		case "OPEN.isNone":
		case "OPEN.isNotLoggedIn":
			return TitleWrapper("Open 1/5", "Answer the Question to win the Reward");

		case "PICKANSWER.isQuestionAuthor":
			return PickAnswer_Question(pickedWinner);
		case "PICKANSWER.isAnswerAuthor":
		case "PICKANSWER.isNone":
		case "PICKANSWER.isNotLoggedIn":
			return TitleWrapper("Winner Selection 2/5", "A Winner is being Selected");

		case "DISPUTABLE.isQuestionAuthor":
			return TitleWrapper(
				"Dispute 3/5",
				"If you answered the Question you can dispute the choice of the Author"
			);
		case "DISPUTABLE.isAnswerAuthor":
			return TitleWrapper(
				"Dispute 3/5",
				"Dispute the Choice of the Question Author"
			);
		case "DISPUTABLE.isNone":
			return TitleWrapper(
				"Dispute 3/5",
				"If you answered the Question you can dispute the choice of the Author"
			);
		case "DISPUTABLE.isNotLoggedIn":
			return TitleWrapper(
				"Dispute 3/5",
				"If you answered the Question you can dispute the choice of the Author"
			);

		case "DISPUTED.isQuestionAuthor":
		case "DISPUTED.isAnswerAuthor":
		case "DISPUTED.isNone":
		case "DISPUTED.isNotLoggedIn":
			return TitleWrapper("Arbitration 4/5", "Arbitration is ongoing");

		case "CLOSED.isQuestionAuthor":
		case "CLOSED.isAnswerAuthor":
		case "CLOSED.isNone":
		case "CLOSED.isNotLoggedIn":
			return TitleWrapper(
				"Payout 5/5",
				"The Reward has been paid to the Winner"
			);

		default:
			return;
	}
};

export default Title;
