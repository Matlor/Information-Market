//if (questionsPerPage >= totalQuestions) return <></>;

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
	var previousOpacity = pageIndex == 0 ? "opacity-[0.5]" : "";

	const decreaseIndex = () => {
		if (pageIndex == 0) {
			return;
		} else {
			setPageIndex(pageIndex - 1);
		}
	};

	let lastPage =
		Math.ceil(totalQuestions / questionsPerPage) - 1 > 0
			? Math.ceil(totalQuestions / questionsPerPage) - 1
			: 0;

	var nextOpacity = pageIndex == lastPage ? "opacity-[0.5]" : "";

	const increaseIndex = () => {
		if (pageIndex == lastPage) {
			return;
		} else {
			setPageIndex(pageIndex + 1);
		}
	};

	// could be more elegant with the nested flex boxes
	return (
		<div className="flex items-center gap-6 w-max">
			<button onClick={decreaseIndex}>
				<div className={`flex gap-4 items-center ${previousOpacity} `}>
					<div className="rotate-180">
						<ArrowIcon strokeWidth={2} size={14} />
					</div>

					{/* <div className="text-normal">Next</div> */}
				</div>
			</button>

			<div className="px-5 py-1 bg-gray-100 rounded-full text-large">
				{pageIndex + 1}
			</div>

			<button onClick={increaseIndex}>
				<div className={`flex gap-4  ${nextOpacity} items-center`}>
					{/* <div className="">Prev</div> */}
					<ArrowIcon strokeWidth={2} size={14} />
				</div>
			</button>
		</div>
	);
};

export default Pagination;

//if (questionsPerPage >= totalQuestions) return <></>;
