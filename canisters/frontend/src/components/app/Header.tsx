import React, { useContext } from "react";

import Button from "../../components/core/Button";
import Logo from "./Logo";
import { Link, useLocation } from "react-router-dom";
import { ILoggedInUser, ILoggedOutUser } from "../../screens/App";
import { ActorContext } from "../api/Context";

import { BellIcon } from "../core/Icons";
import { ProfilePicture } from "../core/Profile";
import FixedWidthWrapper from "../core/FixedWidthWrapper";

// -------------- Types --------------
/* interface IHeader {
	isConnected: boolean;
	login: React.Dispatch<React.SetStateAction<ILoggedInUser | ILoggedOutUser>>;
	logout: React.Dispatch<React.SetStateAction<ILoggedInUser | ILoggedOutUser>>;
	//TODO:
	avatar: string;
} */

// TODO: solve "back" issue
const Header = () => {
	const { login, user } = useContext(ActorContext);
	{
		/* <div className="px-4 lg:px-20"> */
	}
	return (
		<div className="flex justify-between w-full py-5">
			<Link to="/" className="flex-none w-max">
				<Logo />
			</Link>

			{!user?.principal ? (
				<div className="flex items-center gap-8">
					<Link to="/add-question">
						<Button
							size={"lg"}
							arrow={false}
							color={"black"}
							onClick={() => {}}
							text="Ask"
						/>
					</Link>
					<FixedWidthWrapper>
						<Button
							size={"lg"}
							arrow={true}
							color={"none"}
							onClick={login}
							text={"Login"}
						/>
					</FixedWidthWrapper>
				</div>
			) : (
				<div className="flex items-center gap-8 ">
					<Link to="/add-question">
						<Button
							size={"lg"}
							arrow={false}
							color={"black"}
							onClick={() => {}}
							text="Ask"
						/>
					</Link>
					<Link to="/notifications">
						<BellIcon />
					</Link>
					<Link to="/profile">
						<ProfilePicture principal={user.principal} size={35} />
					</Link>
				</div>
			)}
		</div>
	);
};

/* </div> */

/* const Header = () => {
	const { login, logout, user } = useContext(ActorContext);

	const Switch = ({ user, children }) => {
		return (
			<>
				{!user.principal ? (
					<>
						<Link to="/add-question">
							<div className=" w-max">
								<Button
									size={"20"}
									arrow={false}
									color={"black"}
									onClick={() => {}}
									text="Ask"
								/>
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

	return (
		<div className="px-4 lg:px-20 ">
			<div className="flex flex-row justify-between pt-5 mb-14">
				<div className="flex-none w-max">
					<Link to="/" className="">
						<Logo />
					</Link>
				</div>

				<div className="flex flex-row w-fit items-center gap-12  py-[10px]">
					<Switch user={user}>
						<Link to="/add-question">
							<div className=" w-max">
								<Button
									size={"20"}
									arrow={false}
									color={"black"}
									onClick={() => {}}
									text="Ask"
								/>
							</div>
						</Link>
						<Link to="/notifications">
							<div className=" w-max">
								<BellIcon />
							</div>
						</Link>

						<Link to="/profile">
							<div className=" w-max">
								<ProfilePicture principal={user.principal} />
							</div>
						</Link>
					</Switch>
				</div>
			</div>
		</div>
	);
}; */

export default Header;

// scale-75 lg:scale-100
{
	/* TODO: */
}
{
	/* <div className="flex justify-end ">
				{user!.principal && (
					<div>{user!.principal.toString().slice(0, 11)}</div>
				)}
			</div> */
}
