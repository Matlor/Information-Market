import React from "react";
import { ClockIcon } from "./Icons";

const calcTime = (deadlineMinutes) => {
	const currentTime = Math.floor(Date.now() / 1000);
	const diffSeconds = Math.abs(deadlineMinutes * 60 - currentTime);

	const minutes = Math.floor(diffSeconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const years = Math.floor(days / 365);

	const { value, unit } = (() => {
		return years > 0
			? { value: years, unit: years === 1 ? "year" : "years" }
			: days > 0
			? { value: days, unit: days === 1 ? "day" : "days" }
			: hours > 0
			? { value: hours, unit: hours === 1 ? "hour" : "hours" }
			: minutes > 0
			? { value: minutes, unit: minutes === 1 ? "min" : "mins" }
			: { value: "", unit: "" };
	})();

	return { value, unit };
};

const showTimeClass = "flex items-center gap-1 whitespace-nowrap";

const TimeWrapper = ({ children }) => {
	return (
		<div
			data-cy="timeStamp"
			className="flex gap-2 text-gray-500 w-max text-extra-small "
		>
			{children}
		</div>
	);
};

export const TimeLeft = ({ minutes, icon = true }) => {
	if (minutes * 60 < Math.floor(Date.now() / 1000)) return <></>;
	const { value, unit } = calcTime(minutes);

	return (
		<TimeWrapper>
			<div className="self-center">
				{icon ? <ClockIcon borderColor="white" fillColor="black" /> : <></>}
			</div>
			<div className={`${showTimeClass}`}>
				{!value ? (
					/* or closing */
					<div>{"closing soon"}</div>
				) : (
					<>
						<div>{value}</div>
						<div>{unit}</div>
						<div>{"left"}</div>
					</>
				)}
			</div>
		</TimeWrapper>
	);
};

export const TimeStamp = ({ minutes }) => {
	if (minutes * 60 > Math.floor(Date.now() / 1000)) return <></>;
	const { value, unit } = calcTime(minutes);
	return (
		<TimeWrapper>
			<div className="flex">
				<div className={`${showTimeClass}`}>
					{!value ? (
						<div>{"Just Now"}</div>
					) : (
						<>
							<div>{value}</div>
							<div>{unit}</div>
							<div>{"ago"}</div>
						</>
					)}
				</div>
			</div>
		</TimeWrapper>
	);
};

export const FormatDuration = (duration) => {
	if (duration < 24) {
		return `${duration} hours`;
	} else {
		const days = Math.floor(duration / 24);
		const hours = duration % 24;
		if (hours === 0) {
			return `${days} day${days > 1 ? "s" : ""}`;
		} else {
			return `${days} day${days > 1 ? "s" : ""}  ${hours} hour${
				hours > 1 ? "s" : ""
			}`;
		}
	}
};
