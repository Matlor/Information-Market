import React, { useState, useCallback } from "react";
import { ArrowIcon } from "./Icons";
import Loading from "./Loading";

export const LoadingWrapper = ({
	onClick,
	loader = null,
	children,
	...props
}) => {
	console.log("onClick", onClick);
	const [loading, setLoading] = useState(false);

	const handleClick = useCallback(async () => {
		console.log("hit");
		if (onClick.constructor.name === "AsyncFunction") {
			setLoading(true);
			await onClick();
			setLoading(false);
		} else {
			onClick();
		}
	}, [onClick]);

	const showLoader = () => {
		if (loading) {
			return loader ? <>{loader}</> : <Loading />;
		}
		return null;
	};

	const childrenWithLoading = React.Children.map(children, (child) => {
		if (React.isValidElement(child)) {
			return React.cloneElement(child, {
				onClick: handleClick,
				disabled: loading,
			} as React.Attributes & React.PropsWithChildren<{}>);
		}
		return child;
	});

	return (
		<div onClick={handleClick}>
			{loading ? showLoader() : <>{childrenWithLoading}</>}
		</div>
	);
};

export type ButtonSize = "sm" | "lg";
export type Color = "none" | "gray" | "black";

interface ButtonBaseProps {
	onClick?: () => void;
	loader?: React.ReactNode;
	text: string;
}

interface LargeButton extends ButtonBaseProps {
	size: "lg";
	arrow: false;
	color: "black";
}

interface LargeArrowButtonProps extends ButtonBaseProps {
	size: "lg";
	arrow: true;
	color: "none";
}

interface SmallArrowButtonProps extends ButtonBaseProps {
	size: "sm";
	arrow: true;
	color: Color;
}

interface SmallNoArrowButtonProps extends ButtonBaseProps {
	size: "sm";
	arrow: false;
	color: "black";
}

export type ButtonProps =
	| LargeButton
	| LargeArrowButtonProps
	| SmallArrowButtonProps
	| SmallNoArrowButtonProps;

export const UIButton = ({ size, arrow, color, text }: ButtonProps) => {
	// -------------- Button / Content ----------------
	const getColors = (color: Color) => {
		let bgColor, contentColor;
		switch (color) {
			case "gray":
				bgColor = "bg-gray-100";
				contentColor = "black";
				break;
			case "black":
				bgColor = "bg-black";
				contentColor = "white";
				break;
			default:
				bgColor = "bg-transparent";
				contentColor = "black";
				break;
		}
		return { bgColor, contentColor };
	};
	const { bgColor, contentColor } = getColors(color);

	const textClass =
		size === "sm"
			? "text-extra-small"
			: "text-large font-500 leading-lg tracking-wide";

	const paddingClass = {
		sm: {
			white: "p-0",
			gray: "px-4 py-2",
			black: "px-4 py-2",
		},
		lg: {
			white: "p-0",
			gray: "px-5 py-[3px] bg-white border-[2px] border-gray-100",
			black: "px-5 py-[3px] border-[2px] border-gray-100",
		},
	};

	const content = () => {
		return (
			<>
				<div className={`text-${contentColor} `}>{text}</div>
				{arrow && (
					<ArrowIcon
						size={size === "sm" ? 8 : 10}
						strokeWidth={3}
						borderColor={contentColor}
					/>
				)}
			</>
		);
	};

	return (
		<button
			className={`flex w-max items-center font-600 rounded-full ${textClass} ${paddingClass[size][color]}  ${bgColor} focus:outline-none flex items-baseline gap-3`}
		>
			{content()}
		</button>
	);
};
// 			{showLoader() || content()}

const Button = ({ onClick, children, ...props }) => {
	console.log(onClick, "onClick");
	return (
		<LoadingWrapper onClick={onClick}>
			<UIButton {...props} />
		</LoadingWrapper>
	);
};
export default Button;

// const arrowClass = arrow ? "flex items-baseline gap-3" : "";
// ${arrowClass}

/* 
	const colorClass =
		color === "gray"
			? "bg-gray-100 text-black"
			: color === "black"
			? "bg-black text-white"
			: "bg-transparent text-black";
			*/

/* const sizeClass =
		size === "sm" ? "text-extra-small py-2 px-3" : "text-large leading-lg py-1";

	const pxClass = arrow && color === "none" ? "" : "px-5"; */

/* 
		const tailwind = [
		"bg-transparent",
		"bg-black",
		"bg-gray-100",
		"text-black",
		"text-white",
	];
	
	*/

// ------- Loader -------------
/* const [loading, setLoading] = useState(false);
	const handleClick = async () => {
		if (onClick.constructor.name === "AsyncFunction") {
			setLoading(true);
			await onClick();
			setLoading(false);
		} else {
			onClick();
		}
	};

	const showLoader = () => {
		if (loading) {
			return loader ? <>{loader}</> : <Loading />;
		}
		return null;
	}; */
