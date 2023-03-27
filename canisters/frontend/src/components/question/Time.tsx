import React from "react";
import { TimeIcon } from "../core/Icons";

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

const ShowTime = ({ value, unit }) => {
	return (
		<div className="flex gap-1 items-center whitespace-nowrap">
			<div>{value}</div>
			<div>{unit}</div>
		</div>
	);
};

const Wrapper = ({ children }) => {
	return (
		<div
			data-cy="timeStamp"
			className="flex gap-2 w-max text-small-number text-colorTextGrey"
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
			<div className="self-center">{icon ? <TimeIcon /> : <></>}</div>
			<ShowTime value={value} unit={unit} />
		</Wrapper>
	);
};

export const TimeStamp = ({ minutes }) => {
	if (minutes * 60 > Math.floor(Date.now() / 1000)) return <></>;
	const { value, unit } = calcTime(minutes);
	return (
		<Wrapper>
			<div className="flex gap-1">
				<ShowTime value={value} unit={unit} /> <div>ago</div>
			</div>
		</Wrapper>
	);
};
