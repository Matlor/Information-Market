import React from "react";
import { ArrowIcon } from "../core/Icons";

interface Pagination {
	pageIndex: number;
	questionsPerPage: number;
}

interface IPagination {
	pageIndex: number;
	questionsPerPage: number;
	totalQuestions: number;
	setPageIndex: (pageIndex: number) => void;
}

const Pagination = ({
	pageIndex,
	questionsPerPage,
	totalQuestions,
	setPageIndex,
}: IPagination) => {
	var previousOpacity = "";
	if (pageIndex == 0) {
		previousOpacity = "opacity-[0.5]";
	} else {
		previousOpacity = "";
	}

	const decreaseIndex = () => {
		if (pageIndex == 0) {
			return;
		} else {
			setPageIndex(pageIndex - 1);
		}
	};

	var nextOpacity = "";
	if (pageIndex == Math.ceil(totalQuestions / questionsPerPage) - 1) {
		nextOpacity = "opacity-[0.5]";
	} else {
		nextOpacity = "";
	}

	const increaseIndex = () => {
		if (pageIndex == Math.ceil(totalQuestions / questionsPerPage) - 1) {
			return;
		} else {
			setPageIndex(pageIndex + 1);
		}
	};

	//if (questionsPerPage >= totalQuestions) return <></>;

	return (
		<div className="flex mt-[17px] gap-[33px] justify-between items-center px-[30px] py-[20px] w-min rounded-lg">
			<button onClick={decreaseIndex}>
				<div className={`flex gap-[17px] ${previousOpacity} `}>
					<ArrowIcon />
					<div className="text-normal">Next</div>
				</div>
			</button>

			<div className="px-4 py-1 rounded-lg ">{pageIndex + 1}</div>

			<button onClick={increaseIndex}>
				<div className={`flex gap-[17px] ${nextOpacity} items-center`}>
					<div className="">Prev</div>

					<div className="rotate-180">
						<ArrowIcon />
					</div>
				</div>
			</button>
		</div>
	);
};

export default Pagination;
