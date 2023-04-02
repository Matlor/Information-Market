import React from "react";

interface ILoading {
	style?: "filled" | "loading" | "empty";
}

const Loading = ({ style = "loading" }: ILoading) => {
	let className = `w-5 h-5 rounded-full border-2 border-gray-500`;

	switch (style) {
		case "filled":
			className += " bg-gray-500";
			break;
		case "loading":
			className += " animate-spin border  border-l-white ";
			break;
		case "empty":
		default:
			className += " border border-gray-500 ";
			break;
	}

	return <div className={className}></div>;
};

export default Loading;
