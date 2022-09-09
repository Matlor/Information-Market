import Loading from "./Loading";
import { useState } from "react";

const Button = ({
	propFunction,
	text,
	font = "heading1-20x-stretch",
	loading = false,
}) => {
	const [isClicked, setIsClicked] = useState(false);

	const clickHandler = (event) => {
		event.preventDefault();
		setIsClicked(true);
		propFunction();
	};

	return (
		<div className="flex h-[47px]">
			<button
				className={`${font} flex justify-center items-center px-[25px] py-[10px] bg-colorBackgroundComponents shadow-md rounded-lg`}
				onClick={clickHandler}
			>
				{text}
			</button>

			<div
				className={`${
					loading && isClicked ? "visible" : "hidden"
				} flex items-center px-[15px] py-[10px]`}
			>
				<Loading />
			</div>
		</div>
	);
};

export default Button;
