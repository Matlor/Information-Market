import React from "react";

import { useState } from "react";
import Loading from "./Loading";

// TODO: improve with jsx type
interface IButton {
	propFunction: any;
	text?: string;
	font?: string;
	CustomButton?: any;
	CustomLoader?: any;
}

const Button = ({
	propFunction,
	text,
	font = "heading3",
	CustomButton,
	CustomLoader,
}: IButton) => {
	const [isClicked, setIsClicked] = useState(false);

	const ClickWrapper = ({ children }) => {
		const clickHandler = (event: any) => {
			event.preventDefault();
			setIsClicked(true);
			propFunction().then(() => {
				setIsClicked(false);
			});
		};
		return <button onClick={clickHandler}>{children}</button>;
	};

	const ShowButton = () => {
		if (CustomButton) {
			return (
				<ClickWrapper>
					<CustomButton />
				</ClickWrapper>
			);
		} else {
			return (
				<ClickWrapper>
					<div
						className={`w-max h-[45px] ${font} flex justify-center items-center px-[25px] py-[10px] bg-colorBackgroundComponents shadow-md rounded-lg`}
					>
						{text}
					</div>
				</ClickWrapper>
			);
		}
	};

	const ShowLoadingSpinner = () => {
		if (CustomLoader) {
			return <CustomLoader />;
		} else {
			return <Loading color="colorBackgroundComponents" />;
		}
	};

	return isClicked ? (
		<div>{ShowLoadingSpinner()}</div>
	) : (
		<div>{ShowButton()}</div>
	);
};

export default Button;
