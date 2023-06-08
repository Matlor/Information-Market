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
			? { value: years, unit: years === 1 ? "y" : "y" }
			: days > 0
			? { value: days, unit: days === 1 ? "d" : "d" }
			: hours > 0
			? { value: hours, unit: hours === 1 ? "h" : "h" }
			: minutes > 0
			? { value: minutes, unit: minutes === 1 ? "m" : "m" }
			: { value: "", unit: "" };
	})();

	return { value, unit };
};

const showTimeClass = "flex items-center gap-1 whitespace-nowrap";

const TimeWrapper = ({ children, className }) => {
	return (
		<div data-cy="timeStamp" className={`flex gap-2 w-max ${className}`}>
			{children}
		</div>
	);
};

export const TimeLeft = ({
	minutes,
	icon = true,
	className = "text-extra-small",
}) => {
	let { value, unit } = calcTime(minutes);

	// todo: hack, improve this
	if (minutes * 60 < Math.floor(Date.now() / 1000)) {
		value = "";
	}

	return (
		<TimeWrapper className={`${className} gap-1 text-[#B71E02]`}>
			<div className="self-center">
				{icon ? <ClockIcon borderColor="white" fillColor="black" /> : <></>}
			</div>
			<div className={`${showTimeClass}`}>
				{!value ? (
					<div>{"closing soon"}</div>
				) : (
					<div>
						{value}
						{unit} {"left"}
					</div>
				)}
			</div>
		</TimeWrapper>
	);
};

export const TimeStamp = ({ minutes, className = "text-extra-small" }) => {
	const { value, unit } = calcTime(minutes);
	if (minutes * 60 > Math.floor(Date.now() / 1000)) return <></>;
	return (
		<TimeWrapper className={className}>
			<div className="flex">
				<div className={`${showTimeClass}`}>
					{!value ? (
						<div>{"Just Now"}</div>
					) : (
						<div>
							{value}
							{unit}
						</div>
					)}
				</div>
			</div>
		</TimeWrapper>
	);
};

/* export const FormatDuration = (duration) => {
	const days = Math.floor(duration / 24);
	const hours = duration % 24;

	return `Days ${days} : ${hours} Hours`;
}; */

export const FormatDuration = (duration) => {
	const days = Math.floor(duration / 24);
	const hours = duration % 24;

	return { days, hours };

	//` ${days} Days  ${hours} Hours`;
};

/* export const FormatDuration = (duration) => {
	const days = Math.floor(duration / 24);
	const hours = duration % 24;

	return (
		<div className="flex">
			<div className="w-4">{days}</div>
			<div className="mr-3">Days</div>

			<div className="w-[20px]">{hours}</div>
			<div className="">Hours</div>
		</div>
	);
}; */

/* 
export const FormatDuration = (duration) => {
	if (duration < 24) {
		return `${duration} Hours`;
	} else {
		const days = Math.floor(duration / 24);
		const hours = duration % 24;
		if (hours === 0) {
			return `${days} Day${days > 1 ? "s" : ""}`;
		} else {
			return `${days} Day${days > 1 ? "s" : ""}  ${hours} Hour${
				hours > 1 ? "s" : ""
			}`;
		}
	}
}; */
