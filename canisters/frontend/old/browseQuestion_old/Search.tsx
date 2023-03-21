import React from "react";

import { useState } from "react";
import Loading from "../core/Loading";
import { SearchIcon } from "../core/Icons";

interface ISearch {
	searchLoading: boolean;
	setSearchedText: (text: any) => void;
}

const Search = ({ searchLoading, setSearchedText }: ISearch) => {
	const [input, setInput] = useState<string>("");
	const handler = (e) => {
		setInput(e.target.value);
		setSearchedText(e.target.value);
	};

	return (
		<div className="relative max-w-[600px] w-full flex gap-[25px] py-[8px] px-[15px] justify-center items-center ">
			<SearchIcon />
			<input
				className="w-[100%] outline-none placeholder:text-normal text-normal p-0"
				type="text"
				placeholder=""
				value={input}
				onChange={handler}
			/>
			{searchLoading ? (
				<div className="absolute left-[100%] ml-4">
					<Loading />
				</div>
			) : (
				<></>
			)}
		</div>
	);
};

export default Search;
