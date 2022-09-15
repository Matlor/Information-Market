import Loading from "./Loading";
import { useEffect, useState } from "react";

const ButtonSmall = ({
	propFunction,
	text,
	font = "heading-3-18px",
	loading = false,
}: any) => {
	const [isClicked, setIsClicked] = useState(false);
	const clickHandler = (event: any) => {
		event.preventDefault();
		setIsClicked(true);
		propFunction();
	};

	useEffect(() => {
		if (isClicked) {
			setIsClicked(false);
		}
	}, [propFunction]);

	return (
		<div className="flex h-[45px] max-w-max">
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
					} flex items-center px-[15px] py-[10px] absolute  top-1/2 left-[100%] transform  -translate-y-1/2 `}
				>
					<Loading />
				</div>
			</div>
		</div>
	);
};

export default ButtonSmall;
