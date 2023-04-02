import React, { useContext } from "react";
import { Principal } from "@dfinity/principal";
import { TimeStamp } from "./Time";

export const ProfilePicture = ({
	principal,
	size = 32,
}: {
	principal: Principal;
	size: number;
}) => {
	const stringToNumber = (str, min = 0, max = 100) =>
		min +
		(str.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
			(max - min + 1));

	const idNumber = stringToNumber(principal.toString());
	const gridSize = 5;
	const squareSize = size / gridSize;
	const colors = [
		// "white",
		//"#f0f0f0",
		//"#d0d0d0",
		//"#b0b0b0",
		//"#808080",
		//"#ffbf05", // added new color (seagreen)
		//"#07b8ac", // added new color (orange)
		//"#ee5c41", // added new color (orangered)
		"#EE5C41",
		//"#0c1b23", // added new color (mediumslateblue)
		//"#5f667a",
		//"#000000",
	];

	const squares = Array.from({ length: gridSize * gridSize }, (_, i) => {
		const x = (i % gridSize) * squareSize;
		const y = Math.floor(i / gridSize) * squareSize;
		const colorIndex = (idNumber * (i + 1) * 97) % colors.length;

		return (
			<rect
				key={i}
				x={x}
				y={y}
				width={squareSize}
				height={squareSize}
				fill={colors[colorIndex]}
			/>
		);
	});

	return (
		<svg
			width={size}
			height={size}
			viewBox={`0 0 ${size} ${size}`}
			xmlns="http://www.w3.org/2000/svg"
		>
			<defs>
				<clipPath id="circleClip">
					<circle cx={size / 2} cy={size / 2} r={size / 2} />
				</clipPath>
			</defs>
			<g clipPath="url(#circleClip)">{squares}</g>
		</svg>
	);
};

// --------------------  Types --------------------
// TODO: make default profile first letter of name
interface IProfile {
	principal: Principal;
	name: string;
	minutes: number | undefined;
}

export const Profile = ({ principal, name, minutes }: IProfile) => {
	return (
		<div data-cy="profile" className="flex items-center gap-1">
			<ProfilePicture principal={principal} size={32} />
			<div className="flex flex-col justify-center">
				<p className="text-gray-800 text-extra-small font-600 max-w-[100px] text-ellipsis overflow-hidden whitespace-nowrap">
					{name && name}
				</p>

				{minutes && <TimeStamp minutes={minutes} />}
			</div>
		</div>
	);
};
