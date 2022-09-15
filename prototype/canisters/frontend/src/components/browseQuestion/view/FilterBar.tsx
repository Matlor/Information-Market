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
}: any) => {
	return (
		<div className="flex justify-between items-center p-0 ">
			<Search setSearchedText={setSearchedText} />
			<div className="flex items-center p-0 gap-[17px]">
				<Filter
					statusMap={statusMap}
					setStatusMap={setStatusMap}
					myInteractions={myInteractions}
					setMyInteractions={setMyInteractions}
					isConnected={isConnected}
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
