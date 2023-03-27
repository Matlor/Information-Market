import React, { useContext } from "react";

import { LoginButton, AskButton } from "../../components/core/Button";
import Logo from "./Logo";
import { Link, useLocation } from "react-router-dom";
import { ILoggedInUser, ILoggedOutUser } from "../../screens/App";
import { ActorContext } from "../api/Context";

import {
	NavigationNotificationIcon,
	NavigationAddIcon,
	NavigationProfileIcon,
} from "../core/Icons";
import { ProfilePicture } from "../core/Profile";

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

		return (
			<>
				{!user.principal ? (
					<>
						<Link to="/add-question">
							{/* TODO: scale */}
							{/* lg:scale-125 */}
							<div className="text-normal w-max ">
								{/* <NavigationAddIcon /> */}
								<AskButton />
							</div>
						</Link>
						<LoginButton propFunction={login} text={"Login"} />
					</>
				) : (
					<>{children}</>
				)}
			</>
		);
	};

	// scale-75 lg:scale-100
	return (
		<div className="px-4 lg:px-20 ">
			{/* TODO: */}
			{/* <div className="flex justify-end ">
				{user!.principal && (
					<div>{user!.principal.toString().slice(0, 11)}</div>
				)}
			</div> */}
			{/* mb-24 */}
			<div className="flex justify-between flex-row mb-14 pt-5">
				<div className="flex-none w-max">
					<Link to="/" className="">
						<Logo />
					</Link>
				</div>

				{/* used to be: gap-[5.2vw] lg:gap-[100px] */}
				<div className="flex flex-row w-fit items-center gap-12  py-[10px]">
					<Switch user={user}>
						<Link to="/add-question">
							{/* TODO: scale */}
							{/* lg:scale-125 */}
							<div className="text-normal w-max ">
								{/* <NavigationAddIcon /> */}
								<AskButton />
							</div>
						</Link>
						<Link to="/notifications">
							<div className="text-normal w-max ">
								<NavigationNotificationIcon />
							</div>
						</Link>

						<Link to="/profile">
							<div className="text-normal w-max">
								<ProfilePicture principal={user.principal} />
							</div>
						</Link>
					</Switch>
				</div>
			</div>
		</div>
	);
};

export default Header;
