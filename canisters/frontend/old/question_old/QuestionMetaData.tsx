import React from "react";
import {
	moStatusToString,
	capitalStatusToReadable,
	e8sToIcp,
} from "../core/utils/conversions";
import { deadlineToConutdown } from "../core/utils/utils";
import StagesBar from "../browseQuestion/StagesBar";
import {
	QuestionStatus,
	FinalWinner as IFinalWinner,
} from "../../../declarations/market/market.did.d";

const gapDescription = "h-[55px]";

export const Divider = () => {
	return (
		<div className={`w-[100px]`}>
			<div className={`shrink flex justify-center ${gapDescription} `}>
				<div className="bg-colorBackground h-full w-[2px] self-center"></div>
			</div>
		</div>
	);
};

export const Status = ({ status }: { status: QuestionStatus }) => {
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

// TODO: fix the reward into ICP generally
export const Reward = ({ reward }: { reward: number }) => {
	return (
		<div
			className={`flex flex-col ${gapDescription} justify-between w-max-content`}
		>
			<div className="text-normal">Reward</div>
			<div className="flex items-center gap-[14px]">
				<div className="text-normal w-max flex">
					{e8sToIcp(reward)}
					{" ICP"}
				</div>
			</div>
		</div>
	);
};

export const TimeLeft = ({ children }) => {
	return (
		<>
			<div className="flex flex-col ${gapDescription} justify-between">
				<div className="text-normal w-max">Time Left</div>
				<div className="flex gap-[14px] items-center">
					<div className="text-normal">{children}</div>
				</div>
			</div>
		</>
	);
};

export const HowMuchTime = ({ endDateSec }: { endDateSec: number }) => {
	let { days, hours, minutes } = deadlineToConutdown(endDateSec);
	return (
		<div className="flex gap-[1px]">
			<div>{String(days).padStart(2, "0")} </div>:
			<div> {String(hours).padStart(2, "0")} </div>:
			<div> {String(minutes).padStart(2, "0")} </div>
		</div>
	);
};

// TODO: refund
export const ShowPayout = ({ finalWinner }: { finalWinner: IFinalWinner }) => {
	const checkIfRefund = () => {
		if ("Question" in finalWinner) {
			return true;
		} else {
			false;
		}
	};
	return (
		<>
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
