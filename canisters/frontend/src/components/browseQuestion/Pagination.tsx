import React from "react";
import { ArrowIcon } from "../core/Icons";

interface Pagination {
	pageIndex: number;
	questionsPerPage: number;
}

interface IPagination {
	pagination: Pagination;
	totalQuestions: number;
	setPageIndex: (pageIndex: number) => void;
}

const Pagination = ({
	pagination,
	totalQuestions,
	setPageIndex,
}: IPagination) => {
	var previousOpacity = "";
	if (pagination.pageIndex == 0) {
		previousOpacity = "opacity-[0.5]";
	} else {
		previousOpacity = "";
	}

	const decreaseIndex = () => {
		if (pagination.pageIndex == 0) {
			return;
		} else {
			setPageIndex(pagination.pageIndex - 1);
		}
	};

	var nextOpacity = "";
	if (
		pagination.pageIndex ==
		Math.ceil(totalQuestions / pagination.questionsPerPage) - 1
	) {
		nextOpacity = "opacity-[0.5]";
	} else {
		nextOpacity = "";
	}

	const increaseIndex = () => {
		if (
			pagination.pageIndex ==
			Math.ceil(totalQuestions / pagination.questionsPerPage) - 1
		) {
			return;
		} else {
			setPageIndex(pagination.pageIndex + 1);
		}
	};

	//if (pagination.questionsPerPage >= totalQuestions) return <></>;

	return (
		<div className="flex mt-[17px] gap-[33px] justify-between items-center px-[30px] py-[20px] w-min rounded-lg">
			<button onClick={decreaseIndex}>
				<div className={`flex gap-[17px] ${previousOpacity} `}>
					<ArrowIcon />
					<div className="text-normal">Next</div>
				</div>
			</button>

			<div className="text-normal text-colorBackground px-4 py-1 rounded-lg bg-colorIcon ">
				{pagination.pageIndex + 1}
			</div>

			<button onClick={increaseIndex}>
				<div className={`flex gap-[17px] ${nextOpacity} items-center`}>
					<div className="text-normal ">Prev</div>

					<div className="rotate-180">
						<ArrowIcon />
					</div>
				</div>
			</button>
		</div>
	);
};

export default Pagination;
