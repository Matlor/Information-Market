import React, { useContext } from "react";
import { ActorContext } from "../api/Context";
import Footer from "./Footer";

const PageLayout = ({ children }) => {
	//overflow-x-hidden
	return (
		<div className="flex justify-center border-2">
			<div className="px-[18px] max-w-[900px] w-full flex flex-col justify-between  overflow-y-visible border-2">
				{children}
				<Footer />
			</div>
		</div>
	);
};

export default PageLayout;
