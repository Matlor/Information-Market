import React from "react";
import { IconPaginationDec, IconPaginationInc } from "../core/Icons";

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

	return (
		<div className="flex mt-[17px] gap-[33px] justify-between items-center px-[30px] py-[20px] bg-colorBackgroundComponents w-min shadow-md rounded-lg">
			<button onClick={decreaseIndex}>
				<div className={`flex gap-[17px] ${previousOpacity}`}>
					<IconPaginationDec />
					<div className="heading3">Next</div>
				</div>
			</button>

			<div className="heading3">{pagination.pageIndex + 1}</div>

			<button onClick={increaseIndex}>
				<div className={`flex gap-[17px] ${nextOpacity}`}>
					<div className="heading3 ">Prev</div>
					<IconPaginationInc />
				</div>
			</button>
		</div>
	);
};

export default Pagination;
