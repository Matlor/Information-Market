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
	currentWinner: string | undefined;
	currentWinningUser: IUser | undefined;
	potentialWinner: string | undefined;
	potentiallyWinningUser: string | undefined;
}

const QuestionMenu = ({
	currentCase,
	question_id,
	currentWinner,
	currentWinningUser,
	potentiallyWinningUser,
}: IQuestionMenuProps) => {
	// --------------------  Context --------------------
	const { user } = useContext(ActorContext);

	const Menu = ({ children, profile }: { children: any; profile: IUser }) => {
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
				<div>{children}</div>
			</div>
		);
	};

	switch (currentCase) {
		// TODO: user roles should be type sensitive
		case "PICKANSWER.isQuestionAuthor":
			return (
				<Menu profile={currentWinningUser}>
					<Button
						CustomButton={
							<ButtonArrow
								text="Confirm"
								isSelected={currentWinner ? true : false}
							/>
						}
						propFunction={
							currentWinner
								? () => user.market.pick_answer(question_id, currentWinner)
								: async () => {}
						}
						font="heading3"
					/>
				</Menu>
			);

		case "DISPUTABLE.isAnswerAuthor":
			// TODO: user roles should be type sensitive
			// TODO: status should be type sensitive
			return (
				<Menu profile={potentiallyWinningUser}>
					<Button
						CustomButton={
							<ButtonArrow
								text="Dispute"
								isSelected={currentWinner ? true : false}
							/>
						}
						propFunction={() => user.market.dispute(question_id)}
						font="heading3"
					/>
				</Menu>
			);
		default:
			return <></>;
	}
};

export default QuestionMenu;
