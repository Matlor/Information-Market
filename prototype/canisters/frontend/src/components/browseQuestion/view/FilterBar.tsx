import React from "react";

import Search from "./Search";
import Filter from "./Filter";
import Sort from "./Sort";

const FilterBar = ({
	setSearchedText,
	statusMap,
	setStatusMap,
	orderIsAscending,
	setOrderIsAscending,
	setOrderField,
	myInteractions,
	setMyInteractions,
	isConnected,
	filterLoading,
	searchLoading,
}: any) => {
	return (
		<div className="flex flex-col sm:flex-row sm:justify-between gap-normal">
			<div className="sm:w-1/2">
				<Search
					setSearchedText={setSearchedText}
					searchLoading={searchLoading}
				/>
			</div>
			<div className="sm:w-1/2 flex justify-betwee items-center p-0 gap-[17px] sm:justify-end">
				<Filter
					statusMap={statusMap}
					setStatusMap={setStatusMap}
					myInteractions={myInteractions}
					setMyInteractions={setMyInteractions}
					isConnected={isConnected}
					filterLoading={filterLoading}
				/>
				<Sort
					setOrderIsAscending={setOrderIsAscending}
					orderIsAscending={orderIsAscending}
					setOrderField={setOrderField}
				/>
			</div>
		</div>
	);
};

export default FilterBar;
