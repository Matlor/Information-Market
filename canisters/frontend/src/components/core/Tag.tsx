import React from "react";
import { LinkIcon } from "./Icons";

const Wrapper = ({ children }) => {
	return (
		<div
			data-cy="tag"
			className="flex gap-2 text-number bg-colorLines py-[5px] px-6 rounded-[12px]"
		>
			{children}
		</div>
	);
};

export const SelectedTag = () => {
	return <Wrapper>SELECTED</Wrapper>;
};

export const WinnerTag = ({ reward }) => {
	return (
		<Wrapper>
			<div> + {reward} ICP</div>
			<div className="self-center">
				<LinkIcon />
			</div>
		</Wrapper>
	);
};

export const RewardTag = ({ reward }) => {
	return (
		<Wrapper>
			<div className="flex items-center justify-center whitespace-nowrap overflow-hidden ">
				{reward} ICP
			</div>
		</Wrapper>
	);
};

export const StyledReward = ({ reward }) => {
	return (
		<div className="flex h-fit gap-2 bg-[#EE5C41] py-[6px] px-4 rounded-[12px] self-center">
			<div className="flex font-300  tracking-widest text-colorBackground items-center justify-center whitespace-nowrap overflow-hidden ">
				3.22 ICP
			</div>
		</div>
	);
};
{
	/* <div className="flex gap-2 items-center">
</div> */
}

{
	/* <div className=" p-3 rounded-md w-full flex gap-1 bg-[#FDFFED]">
</div> */
}
