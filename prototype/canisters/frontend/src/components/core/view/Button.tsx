import Loading from "./Loading";
import { useState } from "react";

const Button = ({
	propFunction,
	text,
	font = "heading1-20x-stretch",
	loading = false,
}: any) => {
	const [isClicked, setIsClicked] = useState(false);

	const clickHandler = (event: any) => {
		event.preventDefault();
		setIsClicked(true);
		propFunction();
	};

	return (
		<div className="flex h-[47px] max-w-max">
			<div className="relative">
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
		</div>
	);
};

export default Button;
