import React from "react";
import { useState } from "react";
import { IconArrowUpDown } from "../core/Icons";
import { OrderBy, OrderDirection } from "../../screens/BrowseQuestion";

interface IProps {
	setSortOrder: (order: any) => void;
	order: {
		orderBy: OrderBy;
		orderDirection: OrderDirection;
	};
}

const Sort = ({ setSortOrder, order }: IProps) => {
	const [display, setDisplay] = useState<"hidden" | "visible">("hidden");

	window.addEventListener("click", () => {
		if (display === "visible") {
			setDisplay("hidden");
		}
	});

	return (
		<div className="w-full relative text-normal">
			<button
				onClick={(e) => {
					display == "hidden" ? setDisplay("visible") : setDisplay("hidden");
					e.stopPropagation();
				}}
				className="w-full bg-colorRed flex justify-between items-center py-[8px] px-[15px]"
			>
				<div>Sort</div>
				<IconArrowUpDown
					isFull={true}
					isRotated={display === "visible" ? true : false}
				/>
			</button>

			<div
				className={`${display} absolute text-small w-full mt-[5px] shadow-lg flex flex-col rounded-md `}
			>
				<div
					className={`${display} w-full  py-[10px]  flex flex-col justify-center gap-[13px] rounded-md text-12px`}
					onClick={(e) => {
						e.stopPropagation();
						setSortOrder("REWARD");
					}}
				>
					<div className="z-10 flex items-center gap-[18px] px-[15px] justify-between">
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
				</div>

				<div
					className={`${display} w-full  py-[10px]  flex flex-col justify-center gap-[13px] rounded-md bg-colorBackgroundComponents text-12px`}
					onClick={(e) => {
						e.stopPropagation();
						setSortOrder("TIME_LEFT");
					}}
				>
					<div className="z-10 flex items-center gap-[18px] px-[15px] justify-between">
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

export default Sort;
