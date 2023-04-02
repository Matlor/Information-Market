import React from "react";
import { IconArrowUpDown } from "../core/Icons";
import Button from "../core/Button";
import Loading from "../core/Loading";
import Modal from "../core/Modal";

const SortOptions = ({ setSortOrder, order }) => {
	const handleSortOrder = (orderBy) => {
		setSortOrder(orderBy);
	};

	return (
		<div className="min-w-max flex flex-col gap-[13px] p-4 mt-[5px] py-[10px] text-12px">
			{["REWARD", "TIME_LEFT"].map((type) => (
				<div
					key={type}
					className="z-50 flex items-center gap-[18px] justify-between"
					onClick={() => handleSortOrder(type)}
				>
					{type}
					<div className="flex flex-col">
						<div className="rotate-180">
							<IconArrowUpDown
								isFull={
									order.orderBy === type && order.orderDirection === "ASCD"
								}
								size={10}
							/>
						</div>
						<IconArrowUpDown
							isFull={order.orderBy === type && order.orderDirection !== "ASCD"}
							size={10}
						/>
					</div>
				</div>
			))}
		</div>
	);
};

export const Sort = ({ isLoading, setSortOrder, order }) => {
	return (
		<div className="relative">
			{/* Loading */}
			{isLoading && (
				<div className="absolute right-[100%] mr-4">
					<Loading />
				</div>
			)}

			{/* Modal */}
			<Modal view={<div>Search Modal</div>}>
				<SortOptions setSortOrder={setSortOrder} order={order} />
			</Modal>
		</div>
	);
};
