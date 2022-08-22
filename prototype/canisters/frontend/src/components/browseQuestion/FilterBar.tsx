import Search from "./Search";
import Filter from "./Filter";
import Sort from "./Sort";

const FilterBar = () => {
	return (
		<div className="flex justify-between items-center p-0 ">
			<Search />
			<div className="flex items-center p-0 gap-[17px]">
				<Filter />
				<Sort />
			</div>
		</div>
	);
};

export default FilterBar;
