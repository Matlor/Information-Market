import React, { useState } from "react";
import { IconArrowUpDown, FilterIcon } from "../core/Icons";
import { OrderBy, OrderDirection } from "../../screens/BrowseQuestion";
import RoundedCheckbox from "../core/RoundedCheckbox";
import Loading from "../core/Loading";

const Filter = ({ checks, isLoading, setSortOrder, order }) => {
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
		<div className="relative text-normal  items-center ">
			{/* BUTTON */}
			<button
				onClick={(e) => {
					displayHandler();
					e.stopPropagation();
				}}
				className="flex justify-end items-center py-[8px] px-[15px]"
			>
				<div className="scale-125">
					<FilterIcon />
				</div>
			</button>

			{/* MODAL */}
			<div
				className={`${display} right-0 flex absolute text-12px rounded-md shadow-lg bg-colorBackground`}
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				{/* ------------- FILTER -------------- */}
				<div className="min-w-max flex flex-col gap-[13px]  p-4 mt-[5px] py-[10px] ">
					{/* TODO: Could be a component iterating through keys of status obj */}
					{/* ... the rest of the Filter options ... */}
					Filter
					<div
						className="z-50 flex items-center gap-[18px] "
						onClick={() => checks.toggleStatus()}
					>
						Open Only
						<RoundedCheckbox
							isChecked={
								!checks.status.pickanswer &&
								!checks.status.disputable &&
								!checks.status.arbitration &&
								!checks.status.payout &&
								!checks.status.closed
							}
						/>
					</div>
					{/* <div
						className="w-full z-50 flex items-center gap-[18px] "
						onClick={() => checks.setStatus("open")}
					>
						<RoundedCheckbox isChecked={checks.status.open} />
						Open
					</div> */}
					{/* <div
						className="w-full z-50 flex items-center gap-[18px]"
						onClick={() => {
							checks.setStatus("pickanswer");
						}}
					>
						<RoundedCheckbox isChecked={checks.status.pickanswer} />
						Winner Selection
					</div>
					<div
						className="w-full z-50 flex  items-center gap-[18px]"
						onClick={() => checks.setStatus("disputable")}
					>
						<RoundedCheckbox isChecked={checks.status.disputable} />
						Open for Dispute
					</div>
					<div
						className="w-full z-50 flex  items-center gap-[18px]"
						onClick={() => checks.setStatus("arbitration")}
					>
						<RoundedCheckbox isChecked={checks.status.arbitration} />
						Arbitration
					</div>
					<div
						className="w-full z-50 flex  items-center gap-[18px]"
						onClick={() => checks.setStatus("closed")}
					>
						<RoundedCheckbox isChecked={checks.status.closed} />
						Closed
					</div> */}
				</div>
				{/* <div
					className={`${
						user.principal !== undefined ? "visible" : "hidden"
					} h-[1px] bg-colorBackground`}
				></div>{" "}
				{user.principal ? (
					<div
						className="w-full z-50 flex items-center gap-[18px] px-[15px]"
						onClick={() => {
							checks.toggleMyInteractions(user.principal);
						}}
					>
						<RoundedCheckbox isChecked={checks.myInteractions ? true : false} />
						My Interactions
					</div>
				) : (
					<></>
				)} */}

				{/* ------------- SORT -------------- */}
				{/* old: className="w-full  py-[10px]  flex flex-col justify-center gap-[13px] rounded-md bg-colorLines text-12px" */}
				<div className="min-w-max flex flex-col gap-[13px] p-4 mt-[5px] py-[10px] text-12px">
					Sort
					<div
						className="z-50 flex items-center gap-[18px] justify-between"
						onClick={(e) => {
							e.stopPropagation();
							setSortOrder("REWARD");
						}}
					>
						Reward
						<div className="flex flex-col gap-[2px]">
							<IconArrowUpDown
								isFull={
									order.orderBy == "REWARD" && order.orderDirection == "ASCD"
										? true
										: false
								}
								isRotated={true}
							/>
							<IconArrowUpDown
								isFull={
									order.orderBy == "REWARD" && !(order.orderDirection == "ASCD")
										? true
										: false
								}
								isRotated={false}
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
						<div className="flex flex-col gap-[2px]">
							<IconArrowUpDown
								isFull={
									order.orderBy == "TIME_LEFT" && order.orderDirection == "ASCD"
										? true
										: false
								}
								isRotated={true}
							/>
							<IconArrowUpDown
								isFull={
									order.orderBy == "TIME_LEFT" &&
									!(order.orderDirection == "ASCD")
										? true
										: false
								}
								isRotated={false}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Filter;

{
	/* <IconArrowUpDown
				isFull
				isRotated={display === "visible" ? true : false}
			/> */
}
