import Button from "../../../components/core/view/Button";
import Logo from "./Logo";

import { Link, useLocation } from "react-router-dom";

import { useState } from "react";

const Header = ({ isConnected, login, logout, avatar }) => {
	let { pathname } = useLocation();

	const buttonOrProfile = () => {
		if (!isConnected) {
			return (
				<Button propFunction={login} text={"Login"} font={"heading1-stretch"} />
			);
		} else if (isConnected && pathname === "/profile") {
			return <Button propFunction={logout} text={"Logout"} />;
		} else {
			return (
				<Link to="/profile">
					<div className="h-14 flex justify-end">
						<img
							className="w-[60px] h-[60px] p-[5px] rounded-full shadow-md bg-colorBackgroundComponents self-center"
							src={avatar}
							alt=""
						/>
					</div>
				</Link>
			);
		}
	};

	const [isOpen, setIsOpen] = useState(false);
	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	window.addEventListener("click", () => {
		if (isOpen) {
			setIsOpen(false);
		}
	});

	return (
		<div className="flex flex-row p-0 ">
			<div className="flex-1 ">
				<div className="flex-none w-max ">
					<Link to="/">
						<Logo />
					</Link>
				</div>
			</div>

			{/* RESPONSIVE */}
			<div
				className="self-center"
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				<div
					className="w-[200px] px-[8px] flex justify-end items-center self-center heading1-stretch lg:hidden"
					onClick={toggleMenu}
				>
					<div className="space-y-2 ">
						<div className="w-8 h-0.5 bg-colorText"></div>
						<div className="w-8 h-0.5 bg-colorText"></div>
						<div className="w-8 h-0.5 bg-colorText"></div>
					</div>
				</div>
				<div className="hidden lg:flex w-fit flex-row items-center gap-[5.2vw] p-[10px] m-0">
					<Link to="/">
						<div className="heading1-stretch w-max">Browse Question</div>
					</Link>
					<Link to="/add-question">
						<div className="heading1-stretch w-max">Add Question</div>
					</Link>
					{buttonOrProfile()}
				</div>
				<div className="visible lg:hidden">
					<div
						className={`${
							isOpen ? "visible" : "hidden"
						} lg:visible z-10 w-[200px] h-full  p-[10px] absolute flex flex-col  items-start gap-[10px] mt-[10px] bg-colorBackground`}
					>
						<Link to="/">
							<div className="heading1-stretch w-max">Browse Question</div>
						</Link>
						<Link to="/add-question">
							<div className="heading1-stretch w-max">Add Question</div>
						</Link>
						<div className="heading1-stretch italic mt-6">
							Mobile Coming Soon
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Header;
