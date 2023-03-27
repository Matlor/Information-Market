import React, { useState } from "react";
import { IconArrowUpDown } from "../core/Icons";
import { OrderBy, OrderDirection } from "../../screens/BrowseQuestion";
import RoundedCheckbox from "../core/RoundedCheckbox";
import Loading from "../core/Loading";
import { SortButton } from "../core/Button";

const Sort = ({ isLoading, setSortOrder, order }) => {
	// ---------- Context ----------

	const [display, setDisplay] = useState<"hidden" | "visible">("hidden");

	window.addEventListener("click", () => {
		if (display === "visible") {
			setDisplay("hidden");
		}
	});

	const displayHandler = () => {
		if (display === "hidden") {
			setDisplay("visible");
		} else {
			setDisplay("hidden");
		}
	};

	if (isLoading) {
		<div className="absolute right-[100%] mr-4">
			<Loading />
		</div>;
	}

	return (
		<div className="relative text-small ">
			{/* BUTTON */}
			<SortButton
				propFunction={(e) => {
					console.log("hit sort");
					displayHandler();
					e.stopPropagation();
				}}
			/>

			{/* MODAL */}
			<div
				className={`${display} right-0 flex absolute text-12px rounded-md shadow-lg bg-colorBackground`}
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				{/* ------------- SORT -------------- */}
				<div className="min-w-max flex flex-col gap-[13px] p-4 mt-[5px] py-[10px] text-12px">
					<div
						className="z-50 flex items-center gap-[18px] justify-between"
						onClick={(e) => {
							e.stopPropagation();
							setSortOrder("REWARD");
						}}
					>
						Reward
						<div className="flex flex-col">
							<div className="rotate-180">
								<IconArrowUpDown
									isFull={
										order.orderBy == "REWARD" && order.orderDirection == "ASCD"
											? true
											: false
									}
									size={10}
								/>
							</div>
							<IconArrowUpDown
								isFull={
									order.orderBy == "REWARD" && !(order.orderDirection == "ASCD")
										? true
										: false
								}
								size={10}
							/>
						</div>
					</div>
					<div
						className="z-50 flex items-center gap-[18px] justify-between"
						onClick={(e) => {
							e.stopPropagation();
							setSortOrder("TIME_LEFT");
						}}
					>
						Time Left
						<div className="flex flex-col">
							<div className="rotate-180">
								<IconArrowUpDown
									isFull={
										order.orderBy == "TIME_LEFT" &&
										order.orderDirection == "ASCD"
											? true
											: false
									}
									size={10}
								/>
							</div>
							<IconArrowUpDown
								isFull={
									order.orderBy == "TIME_LEFT" &&
									!(order.orderDirection == "ASCD")
										? true
										: false
								}
								size={10}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Sort;
