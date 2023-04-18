import React from "react";
import { LinkIcon } from "./Icons";
import { e8sToIcp } from "../core/utils/conversions";

const Tag = ({ children, className = "" }) => {
	return (
		<div
			className={`text-small font-600 text-gray-500 flex items-center gap-1 px-4  border-gray-200  rounded-1 bg-gray-100 font-400 w-max h-[36px] ${className}`}
		>
			{children}
		</div>
	);
};

export const RewardTag = ({ reward }) => {
	return (
		<Tag>
			<div className="">{e8sToIcp(Number(reward)).toFixed(2)}</div>{" "}
			<div>ICP</div>{" "}
		</Tag>
	);
};

export const RewardIconTag = ({ reward }) => {
	console.log(reward);
	return (
		<Tag className="px-2">
			<div>+</div>
			<div>{e8sToIcp(Number(reward)).toFixed(2)} ICP</div>
			<LinkIcon size={16} />
		</Tag>
	);
};

export const SelectedTag = () => {
	return <Tag>SELECTED </Tag>;
};

export const LoginToSubmitTag = () => {
	return (
		<div
			className={
				"text-small  flex items-center gap-2 px-5 py-3 rounded-1 w-max bg-gray-100"
			}
		>
			Login to Submit
		</div>
	);
};

export default Tag;
