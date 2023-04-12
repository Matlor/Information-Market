import React, { useState } from "react";
import { ArrowIcon } from "./Icons";
import Loading from "./Loading";

// Weird it still allows to pass whatever prop we want

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

const Button = ({
	size,
	arrow,
	color,
	onClick = () => {},
	loader,
	text,
}: ButtonProps) => {
	// ------- Loader Logic -------------
	const [loading, setLoading] = useState(false);
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
	};

	// -------------- Content ----------------
	const sizeClass =
		size === "sm" ? "text-extra-small py-2 px-3" : "text-large leading-lg py-1";
	const pxClass = arrow && color === "none" ? "" : "px-5";
	const arrowClass = arrow ? "flex items-baseline gap-3" : "";

	const colorClass =
		color === "gray"
			? "bg-gray-100 text-black"
			: color === "black"
			? "bg-black text-white"
			: "bg-transparent text-black";

	const content = () => {
		return (
			<div className="flex items-baseline gap-3">
				<div>{text}</div>
				{arrow && (
					<ArrowIcon
						size={size === "sm" ? 8 : 10}
						strokeWidth={3}
						borderColor={color === "black" ? "white" : "black"}
					/>
				)}
			</div>
		);
	};

	return (
		<button
			onClick={handleClick}
			className={`flex w-max items-center font-600 rounded-full ${sizeClass} ${pxClass} ${arrowClass} ${colorClass} focus:outline-none`}
			disabled={loading}
		>
			{showLoader() || content()}
		</button>
	);
};

export default Button;
