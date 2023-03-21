import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { Principal } from "@dfinity/principal";
import { fromNullable } from "@dfinity/utils";
import { blobToBase64Str } from "../core/utils/conversions";
import { ActorContext } from "../../components/api/Context";
import { TimeStamp } from "../question/Time";

const ProfileIcon = ({ id, size = 50 }) => {
	//return <div className="w-[35px] h-[35px] rounded-full bg-colorLines"></div>;
	const gridSize = 5;
	const squareSize = size / gridSize;
	const colors = [
		/* "white",
		"#f0f0f0",
		"#d0d0d0",
		"#b0b0b0",
		"#808080",*/
		"#07b8ac", // added new color (orange)
		"#ee5c41", // added new color (orangered)
		"#ffbf05", // added new color (seagreen)
		"#0c1b23", // added new color (mediumslateblue)
		"#5f667a",
	];

	const squares = Array.from({ length: gridSize * gridSize }, (_, i) => {
		const x = (i % gridSize) * squareSize;
		const y = Math.floor(i / gridSize) * squareSize;
		const colorIndex = (id * (i + 1) * 97) % colors.length;

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
	id: Principal;
	name: string;
	timeStamp: number;
}

const Profile = ({ id, name, timeStamp }: IProfile) => {
	// TODO: not really necessary
	/* async function createDefaultAvatar() {
		return new Promise(async (resolve) => {
			let motoko_image = await fetch(motokoPath);
			var reader = new FileReader();
			reader.readAsDataURL(await motoko_image.blob());
			reader.onload = () => {
				resolve(reader.result);
			};
		});
	} */

	// --------------------  Context --------------------
	const { user } = useContext(ActorContext);

	const [avatar, setAvatar] = useState<string | undefined>(undefined);
	useEffect(() => {
		const fetchAvatar = async () => {
			const avatar = fromNullable(await user.market.get_profile(id));
			if (avatar) {
				setAvatar(blobToBase64Str(avatar));
			}
		};
		fetchAvatar();
		// TODO: is this necessary?
	}, [user.market.get_profile]);

	// TODO: this is to generate a random number based on the string principal
	// TODO: improve this
	const stringToNumber = (str, min = 0, max = 100) =>
		min +
		(str.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
			(max - min + 1));

	return (
		<div data-cy="profile">
			<div className="flex items-center p-0 gap-2.5 w-max">
				{/* {avatar ? (
						<img
							className="rounded-full w-[27px] h-[27px]"
							src={avatar}
							alt=""
						/>
					) : (
						<div className="w-9 h-9 rounded-full  bg-colorLines"></div>
					)} */}

				<ProfileIcon id={stringToNumber(id.toString())} size={32} />

				<div className="flex flex-col">
					<div className="text-small text-colorDark font-600 max-w-[100px] text-ellipsis overflow-hidden whitespace-nowrap">
						{name && name}
					</div>
					{timeStamp && <TimeStamp minutes={timeStamp} />}
				</div>
			</div>
		</div>
	);
};

export default Profile;
