import React, { useState, useRef } from "react";
import Loading from "../core/Loading";
import { SearchIcon, CrossIcon } from "../core/Icons";

interface ISearch {
	searchLoading: boolean;
	setSearchedText: (text: any) => void;
}

const Search = ({ searchLoading, setSearchedText }: ISearch) => {
	const [input, setInput] = useState<string>("");
	const inputRef = useRef(null);
	const [show, setShow] = useState<boolean>(false);

	const handler = (e) => {
		setInput(e.target.value);
		setSearchedText(e.target.value);
	};

	const handleIconClick = () => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
		if (!show) {
			setShow(true);
		}
	};

	window.addEventListener("click", () => {
		if (show) {
			setShow(false);
		}
	});

	const handleClearClick = () => {
		setInput("");
		setSearchedText("");
	};

	return (
		<div className={`flex gap-3 items-center relative  w-max ${show && ""} `}>
			<div
				className={`items-center rounded-full cursor-pointer`}
				onClick={(e) => {
					handleIconClick();
					e.stopPropagation();
				}}
			>
				<SearchIcon borderColor="black" size={17} strokeWidth={1.8} />
			</div>
			<input
				ref={inputRef}
				className="outline-none w-9 md:w-full text-large placeholder:text-gray-500 !font-300 "
				type="text"
				value={input}
				placeholder="Search"
				onChange={handler}
				onClick={(e) => {
					handleIconClick();
					e.stopPropagation();
				}}
			/>

			{show && (
				<div onClick={handleClearClick}>
					<CrossIcon size={15} />
				</div>
			)}

			{/* {searchLoading ? (
				<div className="absolute left-[100%] ml-5">
					<Loading />
				</div>
			) : (
				<></>
			)} */}
		</div>
	);
};

export default Search;
