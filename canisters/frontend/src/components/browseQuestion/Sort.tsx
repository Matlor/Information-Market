import React from "react";
import { SortIcon } from "../core/Icons";
import Loading from "../core/Loading";
import Modal from "../core/Modal";

const SortOptions = ({ setSortOrder, order }) => {
	const handleSortOrder = (orderBy) => {
		setSortOrder(orderBy);
	};

	return (
		<div className="flex flex-col gap-5 px-6 py-5 mt-3 bg-white rounded-2 min-w-max">
			<div
				className="flex items-center gap-6 text-large"
				onClick={() => handleSortOrder("REWARD")}
			>
				<div className="flex flex-col">
					<SortIcon
						fillColor1={
							order.orderBy === "REWARD" && order.orderDirection === "ASCD"
								? "black"
								: "gray-100"
						}
						fillColor2={
							order.orderBy === "REWARD" && order.orderDirection !== "ASCD"
								? "black"
								: "gray-100"
						}
						borderColor="none"
						size={24}
						gap={0}
					/>
				</div>
				Reward
			</div>
			<div
				className="flex items-center gap-6 text-large"
				onClick={() => handleSortOrder("TIME_LEFT")}
			>
				<div className="flex flex-col">
					<SortIcon
						fillColor1={
							order.orderBy === "TIME_LEFT" && order.orderDirection === "ASCD"
								? "black"
								: "gray-100"
						}
						fillColor2={
							order.orderBy === "TIME_LEFT" && order.orderDirection !== "ASCD"
								? "black"
								: "gray-100"
						}
						borderColor="none"
						size={24}
						gap={0}
					/>
				</div>
				Time Left
			</div>
		</div>
	);
};

export const Sort = ({ isLoading, setSortOrder, order, className = "" }) => {
	return (
		<>
			{/* Loading */}
			{isLoading && (
				<div className="absolute right-[100%] mr-4">
					<Loading />
				</div>
			)}

			{/* Modal */}
			<Modal
				view={
					<div
						className={`cursor-pointer w-full h-full flex justify-center items-center ${className}`}
					>
						<SortIcon
							fillColor1={"black"}
							fillColor2={"black"}
							borderColor="black"
							size={16}
						/>
					</div>
				}
				className="bg-white shadow-lg rounded-2"
			>
				<SortOptions setSortOrder={setSortOrder} order={order} />
			</Modal>
		</>
	);
};
