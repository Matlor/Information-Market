import React from "react";

import { useState } from "react";
import Loading from "./Loading";

// TODO: improve with jsx type
interface IButton {
	propFunction: any;
	text?: string;
	font?: string;
	customButton?: any;
	customLoader?: any;
}

const Button = ({
	propFunction,
	text,
	font = "text-normal",
	customButton,
	customLoader = undefined,
}: IButton) => {
	const [isClicked, setIsClicked] = useState(false);

	const clickHandler = (event: any) => {
		event.preventDefault();
		setIsClicked(true);
		propFunction().then(() => {
			setIsClicked(false);
		});
	};

	const DefaultButton = ({ text }) => {
		return (
			<div
				className={`w-max h-[45px] ${font} flex justify-center items-center px-[25px] py-[10px] bg-colorBackgroundComponents  rounded-lg`}
			>
				{text}
			</div>
		);
	};

	const RenderButton = ({ children }) => {
		return (
			<div
				onClick={clickHandler}
				className={isClicked ? "invisible" : "visible"}
			>
				{children}
			</div>
		);
	};

	const RenderLoader = ({ children }) => {
		return (
			<div
				className="absolute"
				style={{ display: isClicked ? "block" : "none" }}
			>
				{children}
			</div>
		);
	};

	return (
		<div className="flex justify-center items-center relative">
			<RenderButton>
				{customButton ? customButton : <DefaultButton text={text} />}
			</RenderButton>
			<RenderLoader>
				{customLoader ? (
					<customLoader />
				) : (
					<Loading color="colorBackgroundComponents" />
				)}
			</RenderLoader>
		</div>
	);
};

export default Button;

// maybe this part was old already
/* const ClickWrapper = ({ children }) => {
		const clickHandler = (event: any) => {
			event.preventDefault();
			setIsClicked(true);
			propFunction().then(() => {
				setIsClicked(false);
			});
		};
		return <button onClick={clickHandler}>{children}</button>;
	}; */

/* if (customButton) {
			return (
				<ClickWrapper>
					<customButton />
				</ClickWrapper>
			);
		} else { */

/* const ShowButton = () => {
		return (
			<button onClick={clickHandler}>
				{customButton ? (
					customButton
				) : (
					<div
						className={`w-max h-[45px] ${font} flex justify-center items-center px-[25px] py-[10px] bg-colorBackgroundComponents shadow-md rounded-lg`}
					>
						{text}
					</div>
				)}
			</button>
		);
	};

	const ShowLoadingSpinner = () => {
		if (customLoader) {
			return <customLoader />;
		} else {
			return <Loading color="colorBackgroundComponents" />;
		}
	};

	return isClicked ? (
		<div>{ShowLoadingSpinner()}</div>
	) : (
		<div>{ShowButton()}</div>
	); */
