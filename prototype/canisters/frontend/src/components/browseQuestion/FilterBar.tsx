import Search from "./Search";
import Filter from "./Filter";
import Sort from "./Sort";

const FilterBar = ({
	setSearchedText,
	statusMap,
	setStatusMap,
	setOrderIsAscending,
	setOrderField,
	orderIsAscending,
}) => {
	return (
		<div className="flex justify-between items-center p-0 ">
			<Search setSearchedText={setSearchedText} />
			<div className="flex items-center p-0 gap-[17px]">
				<Filter statusMap={statusMap} setStatusMap={setStatusMap} />
				<Sort
					setOrderIsAscending={setOrderIsAscending}
					setOrderField={setOrderField}
				/>
			</div>
		</div>
	);
};

export default FilterBar;
