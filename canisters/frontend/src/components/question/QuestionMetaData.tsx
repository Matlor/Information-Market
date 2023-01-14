import React from "react";
import {
	moStatusToString,
	capitalStatusToReadable,
} from "../core/utils/conversions";
import { deadlineToConutdown } from "../core/utils/utils";
import StagesBar from "../browseQuestion/StagesBar";
import {
	QuestionStatus,
	FinalWinner as IFinalWinner,
} from "../../../declarations/market/market.did.d";

// --------- Types ---------
interface IQuestionMetaData {
	status: QuestionStatus;
	endDateSec: number;
	reward: number;
	isTimeShown: boolean;
	isPayoutShown: boolean;
	finalWinner: IFinalWinner | undefined;
}

/* 
	What does this component do?
	- It shows the current status
	- It shows the reward
	
	- if(isTimeShown)  it shows the time
	- if(isPayoutShown) it shows the payout
	
	What I will do is to make these all named export components
	And then wherever needed I put together the thing however it should be
	This will make this nice finally. 

	*/

const gapDescription = "h-[55px]";

export const HowMuchTime = ({ endDateSec, status }) => {
	let { days, hours, minutes } = deadlineToConutdown(endDateSec);
	if (capitalStatusToReadable(moStatusToString(status)) === "ARBITRATION") {
		return <div className="w-max">Within 1 Day</div>;
	} else {
		return (
			<div className="flex gap-[1px]">
				<div>{String(days).padStart(2, "0")} </div>:
				<div> {String(hours).padStart(2, "0")} </div>:
				<div> {String(minutes).padStart(2, "0")} </div>
			</div>
		);
	}
};

export const TimeLeft = ({ status }) => {
	if (capitalStatusToReadable(moStatusToString(status)) === "CLOSED") {
		return <div></div>;
	} else {
		return (
			<>
				<div className="w-[90px]">{divider}</div>
				<div className="flex flex-col ${gapDescription} justify-between">
					<div className="text-normal w-max">Time Left</div>
					<div className="flex gap-[14px] items-center">
						<div className="text-normal">
							<HowMuchTime status={status} />
						</div>
					</div>
				</div>
			</>
		);
	}
};

// TODO: something is wrong
export const ShowPayout = () => {
	const checkIfRefund = () => {
		if ("Question" in finalWinner) {
			return true;
		} else {
			false;
		}
	};
	return (
		<>
			<div className={`w-[90px]`}>{divider}</div>
			<div className={`flex-col ${gapDescription} justify-between `}>
				<div className="text-normal w-max">Payout</div>
				<div className="flex gap-[14px] items-center">
					{checkIfRefund() ? (
						<div className="w-max text-normal">Refund of Author </div>
					) : (
						<div className="w-max text-normal">Paid to Winner</div>
					)}
				</div>
			</div>
		</>
	);
};

export const divider = (
	<div className={`w-[90px]`}>
		<div className={`shrink flex justify-center ${gapDescription} `}>
			<div className="bg-colorBackground h-full w-[2px] self-center"></div>
		</div>
	</div>
);

export const Status = ({ status }) => {
	return (
		<div
			className={`flex flex-col ${gapDescription} justify-between w-max-content`}
		>
			<div className="text-normal w-max ">
				{capitalStatusToReadable(moStatusToString(status))}
			</div>
			<div className="flex gap-[10px] w-max mb-[5px]">
				<StagesBar status={status} />
			</div>
		</div>
	);
};

export const Reward = ({ reward }) => {
	return (
		<>
			<div className="text-normal">Reward</div>
			<div className="flex items-center gap-[14px]">
				<div className="text-normal w-max flex">
					{reward}
					{" ICP"}
				</div>
			</div>
		</>
	);
};

/* 
<div
	className={`flex flex-col ${gapDescription} justify-between w-max-content`}
>

*/
