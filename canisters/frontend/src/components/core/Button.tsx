import React, { Children } from "react";

import { useState } from "react";
import Loading from "./Loading";
import { ArrowSmall, IconArrowUpDown } from "./Icons";

// TODO: improve with jsx type
interface IButton {
	propFunction: any;
	text?: string;
	font?: string;
	customButton?: any;
	customLoader?: any;
	useLoader?: boolean;
}

// TODO: use a tailwind class for buttons

// ---------------------------- UI ----------------------------
const UIDefaultButton = ({ text, font }) => {
	return (
		<div
			className={`hover:cursor-pointer w-max h-[37px] ${font} flex justify-center items-center px-[25px] py-[10px] bg-colorBackgroundComponents  rounded-lg`}
		>
			{text}
		</div>
	);
};

const UIArrowButton = ({ text }) => {
	//  px-4 py-2 bg-colorBackgroundComponents rounded-lg
	return (
		<div className="hover:cursor-pointer flex gap-4 justify-center items-center">
			<p>{text}</p>
			<ArrowSmall />
		</div>
	);
};

const UIArrowButtonFilled = ({ text }) => {
	//  px-4 py-2 bg-colorBackgroundComponents rounded-lg
	return (
		<div className="hover:cursor-pointer flex gap-4 justify-center items-center px-4 py-[6px]  text-colorIcon text-normal rounded-full">
			<p>{text}</p>
			<ArrowSmall fill={"#000000"} />
		</div>
	);
};

const UIAskButton = ({}) => {
	return (
		<div className="hover:cursor-pointer px-8 py-1 bg-colorDark text-small text-colorBackground rounded-full">
			Ask
		</div>
	);
};

const UISortButton = () => {
	return (
		<div className="items-center flex gap-3 bg-colorLines py-2 px-5 rounded-lg">
			<div className="">
				<div className="rotate-180">
					<IconArrowUpDown isFull={true} fullColor="#000000" size={10} />
				</div>
				<div className="">
					<IconArrowUpDown isFull={true} fullColor="#000000" size={10} />
				</div>
			</div>
			<div>Sort</div>
		</div>
	);
};

// ---------------------------- Logic ----------------------------
// On Click Logic
export const ShowLoaderOnClick = ({
	propFunction,
	UILoader = null,
	UIButton,
}) => {
	const [isClicked, setIsClicked] = useState(false);
	const clickHandler = (event: any) => {
		event.preventDefault();
		setIsClicked(true);
		propFunction().then(() => {
			setIsClicked(false);
		});
	};

	if (UILoader) {
		return (
			<div className="flex justify-center items-center relative">
				<div
					onClick={clickHandler}
					className={isClicked ? "invisible" : "visible"}
				>
					{UIButton}
				</div>
				<div
					className="absolute"
					style={{ display: isClicked ? "block" : "none" }}
				>
					{UILoader}
				</div>
			</div>
		);
	} else {
		return <>{UIButton}</>;
	}
};

const RunFunc = ({ propFunction, children }) => {
	return (
		<div onClick={propFunction} className="hover:cursor-pointer">
			{children}
		</div>
	);
};

// ---------------------------- End Logic ----------------------------

export const DefaultButton = ({ propFunction, text, font }) => {
	return (
		<ShowLoaderOnClick
			propFunction={propFunction}
			UIButton={<UIDefaultButton text={text} font="text-normal" />}
			UILoader={<Loading />}
		/>
	);
};

export const ArrowButton = ({ propFunction, text }) => {
	return (
		<RunFunc propFunction={propFunction}>
			<UIArrowButton text={text} />
		</RunFunc>
	);
};

// new
export const StagesButton = ({ propFunction, text, UILoader }) => {
	return (
		<ShowLoaderOnClick
			propFunction={propFunction}
			UIButton={<UIDefaultButton text={text} font="text-normal" />}
			UILoader={UILoader}
		/>
	);
};

// old
/* export const StagesButton = ({ propFunction, text, customLoader }) => {
	return (
		<DefaultButton
			customButton={<UIArrowButton text={text} />}
			customLoader={customLoader}
			propFunction={propFunction}
		/>
	);
}; */

export const SortButton = ({ propFunction }) => {
	return (
		<RunFunc propFunction={propFunction}>
			<UISortButton />
		</RunFunc>
	);
};

export const ToggleButton = ({ propFunction, text, isChecked = false }) => {
	return (
		<button
			onClick={propFunction}
			className={`${
				isChecked ? "bg-colorIcon text-colorBackground" : "bg-colorLines"
			}  hover:cursor-pointer w-max h-[37px] text-small flex justify-center items-center px-[25px] py-[10px] bg-colorBackgroundComponents rounded-lg`}
		>
			{text}
		</button>
	);
};

export const AskButton = () => {
	return (
		<RunFunc propFunction={() => {}}>
			<UIAskButton />
		</RunFunc>
	);
};

export const LoginButton = ({ propFunction, text }) => {
	return (
		<ShowLoaderOnClick
			propFunction={propFunction}
			UIButton={<UIArrowButtonFilled text={text} />}
			UILoader={<Loading />}
		/>
	);
};

/* const ClickWrapper = ({ children }) => {
		return (
			<div
				onClick={clickHandler}
				className={isClicked ? "invisible" : "visible"}
			>
				{children}
			</div>
		);
	};

	const ShowLoaderIfClicked = ({ children }) => {
		return (
			<div
				className="absolute"
				style={{ display: isClicked ? "block" : "none" }}
			>
				{children}
			</div>
		);
	}; */

// if loader is passed do this conditional thing
