import Button from "../core/Button";
import Logo from "./Logo";

const Header = () => {
	return (
		<div className="flex flex-row justify-between items-center p-0 self-stretch">
			<Logo />
			<div className="p-0 flex justify-between items-center gap-[90px] ">
				<div className="heading1-20x-stretch">Browse Question</div>
				<div className="heading1-20x-stretch">Add Question</div>
				<Button />
			</div>
		</div>
	);
};

export default Header;
