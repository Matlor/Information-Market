import React from "react";

interface ILoading {
	color?: "colorLines" | "colorBackgroundComponents";
	style?: "filled" | "empty" | "loading";
}

const Loading = ({ color = "colorLines", style = "loading" }: ILoading) => {
	const basicStyle = "w-[26px] h-[26px] rounded-full";
	const borderWidth = "border-[4px]";
	switch (style) {
		case "filled":
			return (
				<div>
					<div
						className={`${
							color === "colorLines"
								? "bg-colorLines"
								: "bg-colorBackgroundComponents"
						} ${basicStyle}  shadow-md`}
					></div>
				</div>
			);
		case "empty":
			return (
				<div>
					<div
						className={`${
							color === "colorLines"
								? "border-colorLines"
								: "border-colorBackgroundComponents"
						} ${basicStyle} ${borderWidth}  shadow-md`}
					></div>
				</div>
			);
		case "loading":
			return (
				<div>
					<div
						className={`${
							color === "colorLines"
								? "border-l-[transparent] border-colorLines"
								: "border-l-[transparent] border-colorBackgroundComponents"
						} ${basicStyle} ${borderWidth} rounded-full animate-spin`}
					></div>
				</div>
			);
		default:
			return <div></div>;
	}
};

export default Loading;
