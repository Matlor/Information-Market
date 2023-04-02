import React from "react";
import { LinkIcon } from "./Icons";

const Tag = ({ children }) => {
	return (
		<div
			className={
				"text-small flex items-center gap-2 px-2 py-2 rounded-1 w-max bg-gray-100"
			}
		>
			{children}
		</div>
	);
};

export const RewardTag = ({ reward }) => {
	return <Tag>{reward} ICP</Tag>;
};

export const RewardIconTag = ({ reward }) => {
	return (
		<Tag>
			<div>+ {reward} ICP</div>
			<LinkIcon />
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
				"text-extra-small flex items-center gap-2 px-5 py-3 rounded-1 w-max bg-gray-100"
			}
		>
			Login to Submit
		</div>
	);
};

export default Tag;
