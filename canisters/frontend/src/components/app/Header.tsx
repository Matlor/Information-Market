import React, { useContext } from "react";

import { LoadingWrapper } from "../../components/core/Button";
import Logo from "./Logo";
import { Link } from "react-router-dom";
import { ActorContext } from "../api/Context";

import { WrappedLoginIcon, CrossIcon } from "../core/Icons";
import { ProfilePicture } from "../core/Profile";

import { ShapeGrid } from "../core/TestPicture";

// -------------- Types --------------
interface IHeader {
	pagePadding: string;
}

const Header = ({ pagePadding }: IHeader) => {
	const { login, user } = useContext(ActorContext);
	const gaps = "gap-6 xl:gap-7";

	return (
		<div
			className={`test z-20 noisy sticky top-0 border-b-[0.5px] border-gray-800 flex justify-between w-full  bg-white py-2 lg:py-3  ${pagePadding}`}
		>
			<Link to="/" className="flex-none w-max">
				<Logo />
			</Link>

			<div className={`flex items-center ${gaps}`}>
				<Link to="/add-question">
					<div className="rotate-45">
						<CrossIcon size={16} strokeWidth={1.8} borderColor="gray-800" />
					</div>
				</Link>
				{!user?.principal ? (
					<div className="w-[40px] flex justify-center">
						<LoadingWrapper onClick={login}>
							<WrappedLoginIcon
								size={36}
								strokeWidth={1.5}
								borderColor="black"
							/>
						</LoadingWrapper>
					</div>
				) : (
					<Link to="/profile" className="flex items-center gap-1">
						<div className="">
							<ShapeGrid uniqueString={user.principal.toString()} />
						</div>
					</Link>
				)}
			</div>
		</div>
	);
};

export default Header;
