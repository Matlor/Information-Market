import React from "react";

import Loading from "./Loading";
import { useState } from "react";

const NonComposableButton = ({
	propFunction,
	text = "",
	font = "heading3",
	CustomButton,
	CustomLoader,
}: any) => {
	const [isClicked, setIsClicked] = useState(false);

	const clickHandler = (event: any) => {
		event.preventDefault();
		setIsClicked(true);
		propFunction().then(() => {
			setIsClicked(false);
		});
	};

	const Button = () => {
		return (
			<>
				<button
					className={`${font} ${isClicked ? "hidden" : "visible"}  `}
					onClick={clickHandler}
				>
					{CustomButton ? (
						<CustomButton />
					) : (
						<div className="flex justify-center items-center px-[25px] py-[10px] bg-colorBackgroundComponents shadow-md rounded-lg">
							{text}
						</div>
					)}
				</button>
			</>
		);
	};

	const LoadingSpinner = () => {
		return (
			<div
				className={`
				${isClicked ? "visible" : "hidden"} `}
			>
				{CustomLoader ? (
					<div className="flex items-center px-[15px] py-[10px]">
						{CustomLoader}
					</div>
				) : (
					<div className="flex items-center px-[15px] py-[10px]">
						<Loading color="colorBackgroundComponents" />
					</div>
				)}
			</div>
		);
	};

	return (
		<div className="flex h-[45px] max-w-max relative">
			{Button()}
			{LoadingSpinner()}
		</div>
	);
};

export default NonComposableButton;
