import React from "react";
import { SortIcon } from "../core/Icons";
import Button from "../core/Button";
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

export const Sort = ({ isLoading, setSortOrder, order }) => {
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
					<div className="flex items-center gap-3 text-gray-500 font-300 text-large">
						<div className="flex flex-col w-max">
							<SortIcon
								fillColor1={"black"}
								fillColor2={"black"}
								borderColor="black"
								size={16}
							/>
						</div>
						Sort
					</div>
				}
				className="rounded-2"
			>
				<SortOptions setSortOrder={setSortOrder} order={order} />
			</Modal>
		</>
	);
};
/* 


<div className="rotate-180">
							<TriangleIcon
								fillColor={
									order.orderBy === type && order.orderDirection === "ASCD"
										? "black"
										: "#F6F6F6"
								}
								borderColor=""
							/>
						</div>
						<TriangleIcon
							fillColor={
								order.orderBy === type && order.orderDirection !== "ASCD"
									? "black"
									: "#F6F6F6"
							}
							borderColor=""
						/>




*/
