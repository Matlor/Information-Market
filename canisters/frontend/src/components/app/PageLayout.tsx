import React, { useContext } from "react";
import { ActorContext } from "../api/Context";
import Footer from "./Footer";
import Header from "./Header";

const PageLayout = ({ avatar, children }) => {
	const { login, logout, user } = useContext(ActorContext);

	return (
		<div className="pt-[47px] pb-[78px] px-[1vw] lg:px-[8.5vw] min-h-screen flex flex-col justify-between bg-colorBackground overflow-y-visible ">
			<Header
				isConnected={user.principal ? true : false}
				login={login}
				logout={logout}
				avatar={avatar}
			/>
			<div className="pt-[101px] pb-[101px] flex-1 flex flex-col  items-center">
				{children}
			</div>
			<Footer />
		</div>
	);
};

export default PageLayout;
