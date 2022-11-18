import Profile from "../../core/view/Profile";
import Button from "../../core/view/Button";

const QuestionMenu = ({
	currentStatus,
	currentUserRole,
	unsubmittedChoice,
	submitWinner,
	winner,
	submitDispute,
	cachedAvatars,
}) => {
	const selectedUser = (winner) => {
		return (
			<div className=" heading3 flex justify-between w-[500px] h-[44px]  px-field bg-colorBackgroundComponents rounded-md items-center shadow-md">
				<div className="heading3">Selected User</div>

				{winner ? (
					<Profile
						name={winner.author.name}
						avatar={cachedAvatars.get(winner.author.id)}
					/>
				) : (
					<div className="italic heading3">None Selected</div>
				)}
			</div>
		);
	};

	const Icon = () => {
		return (
			<svg
				width="13"
				height="20"
				viewBox="0 0 13 20"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M3.18328 3L10.0818 9.04937M3 16.5325L9.34969 9.85079"
					stroke="#969696"
					strokeWidth="5"
					strokeLinecap="round"
				/>
			</svg>
		);
	};

	const ConfirmButton = () => {
		return (
			<div
				data-cy="ArrowButton"
				className={`w-[200px] h-[44px] px-[20px] flex justify-between items-center relative bg-colorBackgroundComponents rounded-md`}
			>
				<div className={`heading3 ${unsubmittedChoice ? "" : "opacity-[0.5]"}`}>
					Confirm
				</div>
				<div className={`${unsubmittedChoice ? "" : "opacity-[0.5]"}`}>
					<Icon />
				</div>
			</div>
		);
	};

	const DisputeButton = () => {
		return (
			<div
				data-cy="ArrowButton"
				className={`w-[200px] h-[44px] px-[20px] flex justify-between relative bg-colorBackgroundComponents rounded-md items-center `}
			>
				<div className={`heading3`}>Dispute</div>
				<div>
					<Icon />
				</div>
			</div>
		);
	};

	const currentCase = currentStatus + "." + currentUserRole;

	switch (currentCase) {
		case "OPEN.isQuestionAuthor":
		case "OPEN.isAnswerAuthor":
		case "OPEN.isNone":
		case "OPEN.isNotLoggedIn":
			return;

		case "PICKANSWER.isQuestionAuthor":
			return (
				<div className="w-full flex gap-[17px] justify-between items-center">
					<div>{selectedUser(unsubmittedChoice)}</div>
					<div>
						<Button
							propFunction={
								unsubmittedChoice
									? submitWinner
									: async () => {
											return;
									  }
							}
							CustomButton={() => ConfirmButton()}
						/>
					</div>
				</div>
			);
		case "PICKANSWER.isAnswerAuthor":
		case "PICKANSWER.isNone":
		case "PICKANSWER.isNotLoggedIn":
			return;

		case "DISPUTABLE.isQuestionAuthor":
			return;
		case "DISPUTABLE.isAnswerAuthor":
			return (
				<div className="w-full flex gap-[17px] justify-between items-center">
					<div>{selectedUser(winner)}</div>
					<Button
						propFunction={submitDispute}
						text={"Dispute"}
						CustomButton={() => DisputeButton()}
					/>
				</div>
			);
		case "DISPUTABLE.isNone":
		case "DISPUTABLE.isNotLoggedIn":
			return;

		case "DISPUTED.isQuestionAuthor":
		case "DISPUTED.isAnswerAuthor":
		case "DISPUTED.isNone":
		case "DISPUTED.isNotLoggedIn":
			return;

		case "CLOSED.isQuestionAuthor":
		case "CLOSED.isAnswerAuthor":
		case "CLOSED.isNone":
		case "CLOSED.isNotLoggedIn":
			return;
		default:
			return;
	}
};

export default QuestionMenu;
