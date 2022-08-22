import Button from "../core/Button";
import Logo from "./Logo";

import { Link, useLocation } from "react-router-dom";

const Header = () => {
	let { pathname } = useLocation();

	return (
		<div className="flex flex-row justify-between items-center p-0 self-stretch">
			<Link to="/">
				<Logo />
			</Link>
			<div className="p-0 flex justify-between items-center gap-[90px] ">
				<Link to="/">
					<div className="heading1-20x-stretch">Browse Question</div>
				</Link>
				<Link to="/add-question">
					<div className="heading1-20x-stretch">Add Question</div>
				</Link>
				<Button />
			</div>
		</div>
	);
};

export default Header;
