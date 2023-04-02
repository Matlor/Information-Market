import React from "react";
import { ClockIcon } from "./Icons";

const calcTime = (minutes) => {
	const currentTime = Math.floor(Date.now() / 1000);
	const diffSeconds = Math.abs(minutes * 60 - currentTime);

	const remainingMinutes = Math.floor(diffSeconds / 60);
	const hours = Math.floor(remainingMinutes / 60);
	const days = Math.floor(hours / 24);
	const years = Math.floor(days / 365);

	const { value, unit } = (() => {
		if (years > 0) return { value: years, unit: "years" };
		if (days > 0) return { value: days, unit: "days" };
		if (hours > 0) return { value: hours, unit: "hours" };
		return { value: remainingMinutes, unit: "min" };
	})();

	return { value, unit };
};

const ShowTime = ({ value, unit, addOn }) => {
	return (
		<div className="flex items-center gap-1 whitespace-nowrap">
			<div>{value}</div>
			<div>{unit}</div>
			<div>{addOn}</div>
		</div>
	);
};

const Wrapper = ({ children }) => {
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
	console.log(minutes, "m");

	return (
		<Wrapper>
			<div className="self-center">{icon ? <ClockIcon /> : <></>}</div>
			<ShowTime value={value} unit={unit} addOn="" />
		</Wrapper>
	);
};

export const TimeStamp = ({ minutes }) => {
	if (minutes * 60 > Math.floor(Date.now() / 1000)) return <></>;
	const { value, unit } = calcTime(minutes);
	return (
		<Wrapper>
			<div className="flex">
				<ShowTime value={value} unit={unit} addOn="ago" />
			</div>
		</Wrapper>
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
