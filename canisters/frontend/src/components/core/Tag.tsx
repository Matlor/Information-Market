import React from "react";
import { LinkIcon } from "./Icons";
import { e8sToIcp } from "../core/utils/conversions";

const Tag = ({ children, className = "" }) => {
	return (
		<div
			className={`text-small flex items-center gap-2 px-5 py-2 rounded-1 w-max bg-gray-100 ${className}`}
		>
			{children}
		</div>
	);
};

export const RewardTag = ({ reward }) => {
	return <Tag>{e8sToIcp(Number(reward)).toFixed(2)} ICP</Tag>;
};

export const RewardIconTag = ({ reward }) => {
	console.log(reward);
	return (
		<Tag className="px-3">
			<div>+</div>
			<div> {e8sToIcp(Number(reward)).toFixed(2)} ICP</div>
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
				"text-small flex items-center gap-2 px-5 py-3 rounded-1 w-max bg-gray-100"
			}
		>
			Login to Submit
		</div>
	);
};

export default Tag;
