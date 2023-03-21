import React, { useContext } from "react";

import Button from "../../components/core/Button";
import Logo from "./Logo";
import { Link, useLocation } from "react-router-dom";
import { ILoggedInUser, ILoggedOutUser } from "../../screens/App";
import { ActorContext } from "../api/Context";

import {
	NavigationNotificationIcon,
	NavigationAddIcon,
	NavigationProfileIcon,
} from "../core/Icons";

// -------------- Types --------------
/* interface IHeader {
	isConnected: boolean;
	login: React.Dispatch<React.SetStateAction<ILoggedInUser | ILoggedOutUser>>;
	logout: React.Dispatch<React.SetStateAction<ILoggedInUser | ILoggedOutUser>>;
	//TODO:
	avatar: string;
} */

// TODO: solve "back" issue
// TODO: fetch avatar here
const Header = () => {
	const { login, logout, user } = useContext(ActorContext);

	const Switch = ({ user, children }) => {
		let { pathname } = useLocation();
		const isProfilePath = pathname.includes("/profile");

		return (
			<>
				{!user.principal ? (
					<Button propFunction={login} text={"Login"} font={"text-normal"} />
				) : isProfilePath ? (
					<Button propFunction={logout} text={"Logout"} font={"text-normal"} />
				) : (
					<>{children}</>
				)}
			</>
		);
	};

	// scale-75 lg:scale-100
	return (
		<div className="">
			<div className="flex justify-end ">
				{user!.principal && (
					<div>{user!.principal.toString().slice(0, 11)}</div>
				)}
			</div>
			<div className="flex justify-between flex-row p-0 mb-10 lg:mb-[101px] pt-[47px]">
				<div className="flex-none w-max">
					<Link to="/" className="">
						<Logo />
					</Link>
				</div>

				{/* used to be: gap-[5.2vw] */}
				<div className="flex flex-row w-fit items-center gap-10 lg:gap-[100px] py-[10px] m-0 ">
					<Switch user={user}>
						<Link to="/add-question">
							<div className="text-normal w-max lg:scale-125">
								<NavigationAddIcon />
							</div>
						</Link>
						<Link to="/notifications">
							<div className="text-normal w-max lg:scale-125">
								<NavigationNotificationIcon />
							</div>
						</Link>

						<Link to="/profile">
							<div className="text-normal w-max lg:scale-125">
								<NavigationProfileIcon />
							</div>
						</Link>
					</Switch>
				</div>
			</div>
		</div>
	);
};

export default Header;
