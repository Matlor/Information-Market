import React, { useContext } from "react";
import Profile from "../core/Profile";
import Button from "../core/Button";
import { Principal } from "@dfinity/principal";
import { User as IUser } from "../../../declarations/market/market.did.d";
import ButtonArrow from "../core/ButtonArrow";
import { ActorContext } from "../api/Context";

// ------------- Types -------------
// TODO: is avatar type string?
interface IQuestionMenuProps {
	currentCase: string;
	question_id: string;
	currentSelection: string | undefined;
	selectedUser: IUser | undefined;
	potentiallyWinningUser: string | undefined;
}

const QuestionMenu = ({
	currentCase,
	question_id,
	currentWinner,
	currentWinningUser,
	potentialWinner,
	potentiallyWinningUser,
}: IQuestionMenuProps) => {
	// --------------------  Context --------------------
	const { user } = useContext(ActorContext);

	interface IMenu {
		profile: IUser | undefined;
		isSelected: boolean;
		text: string;
		// TODO: fix this
		propFunction: any;
	}

	// TODO: Make this non generic! Split it in two completely separate components
	const Menu = ({ profile, text, propFunction }: IMenu) => {
		return (
			<div className="w-full flex gap-[17px] justify-between items-center">
				<div>
					<div className=" heading3 flex justify-between w-[500px] h-[44px]  px-field bg-colorBackgroundComponents rounded-md items-center shadow-md">
						<div className="heading3">Selected User</div>
						{profile ? (
							<Profile name={profile.name} id={profile.id} />
						) : (
							<div className="italic heading3">None Selected</div>
						)}
					</div>
				</div>
				<div>
					<Button propFunction={propFunction} text={text} font="heading3" />
				</div>
			</div>
		);
	};

	switch (currentCase) {
		case "PICKANSWER.isQuestionAuthor":
			return (
				<Menu
					profile={selectedUser}
					text="Confirm"
					propFunction={
						currentSelection
							? () => user.market.pick_answer(question_id, currentSelection)
							: async () => {}
					}
				/>
			);

		case "DISPUTABLE.isAnswerAuthor":
			return (
				<Menu
					profile={potentiallyWinningUser}
					text="Dispute"
					propFunction={() => user.market.dispute(question_id)}
				/>
			);
		default:
			return <></>;
	}
};

export default QuestionMenu;
