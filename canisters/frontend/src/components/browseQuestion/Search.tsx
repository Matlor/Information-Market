import React, { useState, useRef } from "react";

import Loading from "../core/Loading";
import { SearchIcon, ClearIcon } from "../core/Icons";

interface ISearch {
	searchLoading: boolean;
	setSearchedText: (text: any) => void;
}

const Search = ({ searchLoading, setSearchedText }: ISearch) => {
	const [input, setInput] = useState<string>("");
	const inputRef = useRef(null);

	const handler = (e) => {
		setInput(e.target.value);
		setSearchedText(e.target.value);
	};

	const handleIconClick = () => {
		inputRef.current.focus();
	};

	const handleClearClick = () => {
		setInput("");
		setSearchedText("");
	};

	return (
		<div className="relative max-w-[270px] w-full flex gap-[25px] justify-center items-center">
			<div className="items-center cursor-pointer" onClick={handleIconClick}>
				<SearchIcon />
			</div>
			<input
				ref={inputRef}
				className="w-[100%] outline-none placeholder:text-normal text-normal"
				type="text"
				placeholder=""
				value={input}
				onChange={handler}
			/>

			<div onClick={handleClearClick}>{input && <ClearIcon />}</div>

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
