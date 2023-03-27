import React from "react";
import { OnIcon, OngoingIcon, DownArrowIcon } from "../core/Icons";

const RoundWrapper = ({ children, color = "bg-[#F8F8F8]" }) => {
	return (
		<div
			className={`flex ${color}  rounded-full p-2  items-center justify-center`}
		>
			{children}
		</div>
	);
};

export const On = () => {
	return (
		<RoundWrapper color={"bg-[#EE5C41]"}>
			<div className="bg-colorBackground rounded-full w-3 h-3"></div>
		</RoundWrapper>
	);
};

export const Ongoing = () => {
	return (
		<RoundWrapper color={"bg-[#F8F8F8]"}>
			<div className="rounded-full w-3 h-3">
				<img src="../../../assets/ongoing.png" alt="Image description" />
			</div>
		</RoundWrapper>
	);
};

export const Closed = ({ size }) => {
	return (
		<RoundWrapper color={"bg-[#F8F8F8]"}>
			<DownArrowIcon size={size} fill={"#000000"} />
		</RoundWrapper>
	);
};

const Solution = ({ option }) => {
	return (
		<div className="p-2 rounded-md w-full flex gap-[10px]">
			<On />
			<Ongoing />
			<Closed size={12} />
		</div>
	);
};
//<div className="opacity-20"></div>
export default Solution;
