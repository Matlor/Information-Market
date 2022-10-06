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

	return (
		<div className="flex gap-[33px] justify-between items-center px-[35px] py-[30px] bg-colorBackgroundComponents w-min shadow-md rounded-lg">
			<div className={`flex gap-[17px] ${previousOpacity}`}>
				<button onClick={decreaseIndex}>
					<svg
						width="12"
						height="18"
						viewBox="0 0 12 18"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M9.98772 16.4453L2 9.78883M9.82836 1.55472L2.47609 8.90699"
							stroke="#969696"
							strokeWidth="2.67884"
							strokeLinecap="round"
						/>
					</svg>
				</button>
				<div className="heading3">Next</div>
			</div>

			<div className="heading3">{pageIndex + 1}</div>

			<div className={`flex gap-[17px] ${nextOpacity}`}>
				<div className="heading3 ">Prev</div>

				<button onClick={increaseIndex}>
					<svg
						width="12"
						height="18"
						viewBox="0 0 12 18"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M2.20001 1.55472L10.1877 8.21115M1.98779 16.4453L9.34006 9.093"
							stroke="#969696"
							strokeWidth="2.67884"
							strokeLinecap="round"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
};

export default Pagination;
