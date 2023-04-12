import React, { useContext } from "react";
import { ActorContext } from "../api/Context";
import Footer from "./Footer";

const Page = ({ children, Header }) => {
	//overflow-x-hidden

	let space = 10;

	return (
		<div
			className={`min-h-screen flex flex-col items-center overflow-y-visible px-[18px] w-full`}
		>
			{Header}
			<div className="max-w-[900px] w-full flex flex-col justify-between gap-9 my-7 flex-grow">
				{children}
			</div>
			<Footer />
		</div>
	);
};

const List = ({ children }) => {
	return <div className="flex flex-col justify-center gap-9">{children}</div>;
};

export { List, Page };
