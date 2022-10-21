import Button from "../../../components/core/view/Button";
import Logo from "./Logo";

import { Link, useLocation } from "react-router-dom";

const Header = ({ isConnected, login, logout, avatar }) => {
	let { pathname } = useLocation();

	const buttonOrProfile = () => {
		if (!isConnected) {
			return <Button propFunction={login} text={"Login"} loading={true} />;
		} else if (isConnected && pathname === "/profile") {
			return <Button propFunction={logout} text={"Logout"} />;
		} else {
			return (
				<Link to="/profile">
					<div className="w-[110px] flex justify-cente">
						<img
							className="w-14 h-14 rounded-full shadow-md bg-colorBackgroundComponents"
							src={avatar}
							alt=""
						/>
					</div>
				</Link>
			);
		}
	};

	return (
		<div className="flex flex-row justify-between items-center p-0 self-stretch">
			<Link to="/">
				<Logo />
			</Link>
			<div className="p-0 flex justify-between items-center gap-[6vw] ">
				<Link to="/">
					<div className="heading1-stretch">Browse Question</div>
				</Link>
				<Link to="/add-question">
					<div className="heading1-stretch">Add Question</div>
				</Link>
				{buttonOrProfile()}
			</div>
		</div>
	);
};

export default Header;
