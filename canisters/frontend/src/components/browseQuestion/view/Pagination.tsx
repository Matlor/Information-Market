import React from "react";

const Pagination = ({
	pageIndex,
	setPageIndex,
	totalQuestions,
	questionsPerPage,
}) => {
	var previousOpacity = "";
	if (pageIndex == 0) {
		previousOpacity = "opacity-[0.5]";
	} else {
		previousOpacity = "";
	}

	var nextOpacity = "";
	if (pageIndex == Math.floor(totalQuestions / questionsPerPage)) {
		nextOpacity = "opacity-[0.5]";
	} else {
		nextOpacity = "";
	}

	const decreaseIndex = () => {
		if (pageIndex == 0) {
			return;
		} else {
			setPageIndex(pageIndex - 1);
		}
	};

	const increaseIndex = () => {
		if (pageIndex == Math.floor(totalQuestions / questionsPerPage)) {
			return;
		} else {
			setPageIndex(pageIndex + 1);
		}
	};

	if (totalQuestions <= questionsPerPage) {
		return <div></div>;
	}

	return (
		<div className="flex mt-[17px] gap-[33px] justify-between items-center px-[30px] py-[20px] bg-colorBackgroundComponents w-min shadow-md rounded-lg">
			<button onClick={decreaseIndex}>
				<div className={`flex gap-[17px] ${previousOpacity}`}>
					<svg
						width="12"
						height="18"
						viewBox="0 0 12 18"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="self-center"
					>
						<path
							d="M9.98772 16.4453L2 9.78883M9.82836 1.55472L2.47609 8.90699"
							stroke="#969696"
							strokeWidth="2.67884"
							strokeLinecap="round"
						/>
					</svg>

					<div className="heading3">Next</div>
				</div>
			</button>

			<div className="heading3">{pageIndex + 1}</div>
			<button onClick={increaseIndex}>
				<div className={`flex gap-[17px] ${nextOpacity}`}>
					<div className="heading3 ">Prev</div>

					<svg
						width="12"
						height="18"
						viewBox="0 0 12 18"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="self-center"
					>
						<path
							d="M2.20001 1.55472L10.1877 8.21115M1.98779 16.4453L9.34006 9.093"
							stroke="#969696"
							strokeWidth="2.67884"
							strokeLinecap="round"
						/>
					</svg>
				</div>
			</button>
		</div>
	);
};

export default Pagination;
