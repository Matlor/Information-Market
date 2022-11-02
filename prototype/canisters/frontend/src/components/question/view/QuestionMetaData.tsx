import { questionStatusToString } from "../../core/services/utils/conversions";
import StagesBar from "../../browseQuestion/view/StagesBar";

const QuestionMetaData = ({ status, endDateSec, reward, isTimeShown }) => {
	const gapDescription = "h-[55px]";

	const divider = (
		<div className={`shrink flex justify-center ${gapDescription} `}>
			<div className="bg-colorBackground h-full w-[2px] self-center"></div>
		</div>
	);

	const showStatus = () => {
		return (
			<>
				<div
					className={`flex flex-col ${gapDescription} justify-between w-max-content`}
				>
					<div className="text-normal w-max ">
						{questionStatusToString(status)}
					</div>
					<div className="flex gap-[10px] w-max mb-[5px]">
						<StagesBar status={status} />
					</div>
				</div>
			</>
		);
	};

	const showReward = () => {
		return (
			<>
				<div className={`w-[90px]`}>{divider}</div>

				<div
					className={`flex flex-col ${gapDescription} justify-between w-max-content`}
				>
					<div className="text-normal">Reward</div>
					<div className="flex items-center gap-[14px]">
						<div className="text-normal w-max flex">
							{reward}
							{" ICP"}
						</div>
					</div>
				</div>
			</>
		);
	};

	const showTime = () => {
		const now = Date.now() / 1000;
		const totalSeconds = endDateSec - now;

		const totalMinutes = Math.max(0, totalSeconds) / 60;

		const floatDays = totalMinutes / 60 / 24;
		const days = Math.floor(totalMinutes / 60 / 24);
		const dayRemainder = floatDays - days;

		const floatHours = dayRemainder * 24;
		const hours = Math.floor(floatHours);

		const hourRemainder = floatHours - hours;
		const floatMinutes = hourRemainder * 60;
		const minutes = Math.round(floatMinutes);
		// {`${isTimeShown ? "flex" : "hidden"}`}
		if (status === "CLOSED") {
			return;
		} else {
			return (
				<>
					<div className={`${isTimeShown ? "" : "hidden"} w-[90px]`}>
						{divider}
					</div>
					<div
						className={`${
							isTimeShown ? "flex" : "hidden"
						} flex-col ${gapDescription} justify-between  `}
					>
						<div className="text-normal w-max">Time Left</div>
						<div className="flex gap-[14px] items-center">
							<div className="text-normal">
								{status === "DISPUTED" ? (
									<div className="w-max">Within 1 Day</div>
								) : (
									<div className="flex gap-[1px]">
										<div>{String(days).padStart(2, "0")} </div>:
										<div> {String(hours).padStart(2, "0")} </div>:
										<div> {String(minutes).padStart(2, "0")} </div>
									</div>
								)}
							</div>
						</div>
					</div>
				</>
			);
		}
	};

	return (
		<div className="flex">
			{showStatus()}
			{showReward()}
			{showTime()}
		</div>
	);
};

export default QuestionMetaData;
