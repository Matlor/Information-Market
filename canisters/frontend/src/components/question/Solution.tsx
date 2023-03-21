import React from "react";
import { OnIcon, OngoingIcon, ClosedIcon } from "../core/Icons";

const Solution = ({ option }) => {
	const renderContent = () => {
		return (
			<div className="p-2 rounded-md w-full flex gap-1 bg-[#FDFFED]">
				<OnIcon />
				<OngoingIcon />
				<ClosedIcon />
				<div className="opacity-20"></div>
			</div>
		);
		switch (option) {
			case "open":
				return (
					<>
						<div className="opacity-20">Solution</div>
						<OnIcon />
					</>
				);

			case "ongoing":
				return (
					<>
						<div className="opacity-20">Solution</div>
						<OngoingIcon />
					</>
				);

			case "closed":
				return (
					<>
						<div className="">Solution</div>
						<ClosedIcon />
					</>
				);

			default:
				return null;
		}
	};

	return (
		<div
			data-cy="solution"
			className="flex flex-row gap-4 text-normal items-center justify-center"
		>
			{renderContent()}
		</div>
	);
};

export default Solution;

/* import React from "react";
import { DownArrowIcon } from "../core/icons";

const Solution = ({ option }) => {
	const Wrapper = ({ children }) => {
		return (
			<div
				data-cy="solution"
				className="flex flex-row gap-4 text-normal items-center justify-center"
			>
				Solution
				<div className="outer bg-colorLines rounded-full bg-gray-300 w-8 h-8 relative">
					<div className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
						{children}
					</div>
				</div>
			</div>
		);
	};

	switch (option) {
		case "open":
			return (
				<Wrapper>
					<div className="inner bg-colorIcon rounded-full bg-white w-4 h-4"></div>
				</Wrapper>
			);

		case "ongoing":
			return (
				<Wrapper>
					<img src="../../../assets/ongoing.png" alt="Image description" />
				</Wrapper>
			);

		case "closed":
			return (
				<Wrapper>
					<DownArrowIcon />
				</Wrapper>
			);

		default:
			return null;
	}
};

export default Solution;
 */
