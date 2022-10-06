import FieldWrapper from "../../core/view/FieldWrapper";
import Profile from "../../core/view/Profile";
import { useState, useEffect } from "react";

const QuestionMenu = ({
	currentStatus,
	currentUserRole,
	timeLeftMin,
	reward,
	submitWinner,
	submitDispute,
	pickedWinner,
	finalWinner,
}) => {
	const makePositive = (number) => {
		if (number > 0) {
			return number;
		} else {
			return 0;
		}
	};

	const [timeLeft, setTimeLeft] = useState<number>(
		makePositive(timeLeftMin * 60 - Date.now() / 1000) / 60
	);

	useEffect(() => {
		const interval = setInterval(() => {
			setTimeLeft((timeLeftMin * 60 - Date.now() / 1000) / 60);
		}, 5000);
		return () => clearInterval(interval);
	}, [timeLeft]);

	const showTimeLeft = (totalMinutes) => {
		const floatDays = totalMinutes / 60 / 24;
		const days = Math.floor(totalMinutes / 60 / 24);
		const dayRemainder = floatDays - days;

		const floatHours = dayRemainder * 24;
		const hours = Math.floor(floatHours);

		const hourRemainder = floatHours - hours;
		const floatMinutes = hourRemainder * 60;
		const minutes = Math.round(floatMinutes);

		return (
			<div className="flex gap-[4px]">
				<div className="relative ">
					<div> {days} </div>
				</div>
				:
				<div className="relative ">
					<div> {hours} </div>
				</div>
				:
				<div className="relative ">
					<div> {minutes} </div>
				</div>
			</div>
		);
	};

	const Divider = (
		<div className="bg-colorBackground w-[12px] h-[9.5px] rounded-full"></div>
	);

	const FieldWithDivider = (description, variable) => {
		return (
			<FieldWrapper>
				<div className="heading3">{description}</div>
				{Divider}
				<div className="heading3">{variable}</div>
			</FieldWrapper>
		);
	};

	const FieldWithEffect = (description, hasEffect = false) => {
		return (
			<div className={`heading3 ${hasEffect ? "shadow-effect" : "shadow-md"}`}>
				<FieldWrapper>{description}</FieldWrapper>
			</div>
		);
	};

	const ArrowButton = (enabled = false) => {
		return (
			<div
				className={`w-[44px] h-[44px] bg-colorBackgroundComponents rounded-full items-center ${
					enabled ? "shadow-effect" : "shadow-md"
				} relative`}
				data-cy="ArrowButton"
			>
				<div
					className={`${
						enabled ? "" : "opacity-[0.5]"
					} absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
				>
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
				</div>
			</div>
		);
	};
	const ArrowButtonEnabled = ArrowButton(true);
	const ArrowButtonDisabled = ArrowButton(false);

	const CheckMark = () => {
		return (
			<div className="w-[44px] h-[44px] rounded-full shadow-md bg-colorBackgroundComponents relative">
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
					<svg
						width="24"
						height="16"
						viewBox="0 0 24 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<line
							x1="2.42564"
							y1="7.38867"
							x2="9.29182"
							y2="14.2549"
							stroke="#969696"
							strokeWidth="2.32"
							strokeLinecap="round"
						/>
						<line
							x1="10.0192"
							y1="14.2546"
							x2="22.3436"
							y2="1.24552"
							stroke="#969696"
							strokeWidth="2.32"
							strokeLinecap="round"
						/>
					</svg>
				</div>
			</div>
		);
	};

	// -------------------------- MENUS ----------------------------
	const Open = (reward) => {
		return (
			<div className="flex justify-between items-center" data-cy="QuestionMenu">
				<div className="flex gap-[12px] items-center">
					<div>{FieldWithDivider("Reward", `${reward.toFixed(2)} ICP`)}</div>
					<div>{FieldWithDivider("Time Left", showTimeLeft(timeLeft))}</div>
				</div>
				<div className="flex gap-[12px] items-center"></div>
			</div>
		);
	};

	const PickWinner_Answer_None_NotLoggedIn = (reward) => {
		return (
			<div className="flex justify-between items-center" data-cy="QuestionMenu">
				<div className="flex gap-[12px] items-center">
					<div>{FieldWithDivider("Reward", `${reward.toFixed(2)} ICP`)}</div>
					<div>{FieldWithDivider("Time Left", showTimeLeft(timeLeft))}</div>
				</div>
				<div className="flex gap-[12px] items-center"></div>
			</div>
		);
	};

	const PickWinner_Question_NotSelected = (reward) => {
		return (
			<div className="flex justify-between items-center" data-cy="QuestionMenu">
				<div className="flex gap-[12px] items-center">
					<div>{FieldWithDivider("Reward", `${reward.toFixed(2)} ICP`)}</div>
					<div>{FieldWithDivider("Time Left", showTimeLeft(timeLeft))}</div>
				</div>
				<div className="flex gap-[12px] items-center">
					{FieldWithDivider(
						"Selected User",
						<div className="italic">None Selected</div>
					)}
					{ArrowButtonDisabled}
				</div>
			</div>
		);
	};

	const PickWinner_Question_Selected = (reward, pickedWinner, submitWinner) => {
		return (
			<div className="flex justify-between items-center" data-cy="QuestionMenu">
				<div className="flex gap-[12px] items-center">
					<div>{FieldWithDivider("Reward", `${reward.toFixed(2)} ICP`)}</div>
					<div>{FieldWithDivider("Time Left", showTimeLeft(timeLeft))}</div>
				</div>
				<div className="flex gap-[12px] items-center">
					<div>
						{FieldWithDivider(
							"Selected User",
							<Profile name={pickedWinner.name} avatar={pickedWinner.avatar} />
						)}
					</div>
					<button
						className="flex gap-[12px] items-center"
						onClick={submitWinner}
					>
						{FieldWithEffect("Confirm", true)}
						{ArrowButtonEnabled}
					</button>
				</div>
			</div>
		);
	};

	const PickWinner_Question = (reward, pickedWinner, submitWinner) => {
		if (!pickedWinner) {
			return PickWinner_Question_NotSelected(reward);
		} else {
			return PickWinner_Question_Selected(reward, pickedWinner, submitWinner);
		}
	};

	const Dispute_Answer = (reward, pickedWinner, submitDispute) => {
		return (
			<div className="flex justify-between items-center" data-cy="QuestionMenu">
				<div className="flex gap-[12px] items-center">
					<div>{FieldWithDivider("Reward", `${reward.toFixed(2)} ICP`)}</div>
					<div>{FieldWithDivider("Time Left", showTimeLeft(timeLeft))}</div>
				</div>
				<div className="flex gap-[12px] items-center">
					<div>
						{FieldWithDivider(
							"Selected User",
							<Profile name={pickedWinner.name} avatar={pickedWinner.avatar} />
						)}
					</div>
					<button
						className="flex gap-[12px] items-center"
						onClick={submitDispute}
					>
						{FieldWithEffect("Dispute", true)}
						{ArrowButtonEnabled}
					</button>
				</div>
			</div>
		);
	};

	const Dispute_Question_None_NotLoggedIn = (reward, pickedWinner) => {
		return (
			<div className="flex justify-between items-center" data-cy="QuestionMenu">
				<div className="flex gap-[12px] items-center">
					<div>{FieldWithDivider("Reward", `${reward.toFixed(2)} ICP`)}</div>
					<div>{FieldWithDivider("Time Left", showTimeLeft(timeLeft))}</div>
				</div>
				<div className="flex gap-[12px] items-center">
					{FieldWithDivider(
						"Selected User",
						<Profile name={pickedWinner.name} avatar={pickedWinner.avatar} />
					)}
				</div>
			</div>
		);
	};

	const Arbitration = (reward) => {
		return (
			<div className="flex justify-between items-center" data-cy="QuestionMenu">
				<div className="flex gap-[12px] items-center">
					<div>{FieldWithDivider("Reward", `${reward.toFixed(2)} ICP`)}</div>
					<div>{FieldWithDivider("Time Left", showTimeLeft(timeLeft))}</div>
				</div>
				<div className="flex gap-[12px] items-center"></div>
			</div>
		);
	};

	const Payout = (reward, finalWinner) => {
		return (
			<div className="flex justify-between items-center" data-cy="QuestionMenu">
				<div className="flex gap-[12px] items-center">
					<div>{FieldWithDivider("Reward", `${reward.toFixed(2)} ICP`)}</div>
					{CheckMark()}
					<div>
						{FieldWithDivider(
							"Final Winner",
							<Profile name={finalWinner.name} avatar={finalWinner.avatar} />
						)}
					</div>
				</div>
				<div className="flex gap-[12px] items-center"></div>
			</div>
		);
	};

	// -------------------------- Cases ----------------------------

	const currentCase = currentStatus + "." + currentUserRole;
	switch (currentCase) {
		case "OPEN.isQuestionAuthor":
		case "OPEN.isAnswerAuthor":
		case "OPEN.isNone":
		case "OPEN.isNotLoggedIn":
			return Open(reward);

		case "PICKANSWER.isQuestionAuthor":
			return PickWinner_Question(reward, pickedWinner, submitWinner);
		case "PICKANSWER.isAnswerAuthor":
		case "PICKANSWER.isNone":
		case "PICKANSWER.isNotLoggedIn":
			return PickWinner_Answer_None_NotLoggedIn(reward);

		case "DISPUTABLE.isQuestionAuthor":
			return Dispute_Question_None_NotLoggedIn(reward, pickedWinner);
		case "DISPUTABLE.isAnswerAuthor":
			return Dispute_Answer(reward, pickedWinner, submitDispute);
		case "DISPUTABLE.isNone":
			return Dispute_Question_None_NotLoggedIn(reward, pickedWinner);
		case "DISPUTABLE.isNotLoggedIn":
			return Dispute_Question_None_NotLoggedIn(reward, pickedWinner);

		case "DISPUTED.isQuestionAuthor":
		case "DISPUTED.isAnswerAuthor":
		case "DISPUTED.isNone":
		case "DISPUTED.isNotLoggedIn":
			return Arbitration(reward);

		case "CLOSED.isQuestionAuthor":
		case "CLOSED.isAnswerAuthor":
		case "CLOSED.isNone":
		case "CLOSED.isNotLoggedIn":
			return Payout(reward, finalWinner);
		default:
			return;
	}
};

export default QuestionMenu;
