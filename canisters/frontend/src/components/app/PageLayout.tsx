import React, { useContext } from "react";
import { ActorContext } from "../api/Context";
import Footer from "./Footer";

// 721 max width of content I think
// footer and header can have margin above and below. Content does not need to have it
const PageLayout = ({ children }) => {
	//lg:px-[15vw]  xl:px-[28vw] min-h-screen
	// this works very well but not with sticky thing: max-w-[1000px]

	return (
		<div className="flex justify-center">
			<div className="px-[18px] max-w-[1000px] w-full flex flex-col justify-between bg-colorBackground overflow-y-visible">
				{children}
				<Footer />
			</div>
		</div>
	);
};

export default PageLayout;

// const { login, logout, user } = useContext(ActorContext);
// avatar

/* 
<Header
	isConnected={user.principal ? true : false}
	login={login}
	logout={logout}
	avatar={avatar}
/>
<div className="flex-1 flex flex-col items-center ">{children}</div>
<Footer />

*/

/* 
const PageLayout = ({ avatar, children }) => {
	const { login, logout, user } = useContext(ActorContext);

	return (
		<div className="pt-[47px] pb-[78px] px-[1vw] lg:px-[8.5vw] min-h-screen flex flex-col justify-between bg-colorBackground overflow-y-visible">
			<Header
				isConnected={user.principal ? true : false}
				login={login}
				logout={logout}
				avatar={avatar}
			/>
			<div className="pt-[101px] pb-[101px] flex-1 flex flex-col items-center ">
				{children}
			</div>
			<Footer />
		</div>
	);
};

*/
