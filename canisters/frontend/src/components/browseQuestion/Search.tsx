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
		<div className={`flex gap-4 items-center relative w-max ${show && ""} `}>
			<div
				className={`items-center rounded-full cursor-pointer`}
				onClick={(e) => {
					handleIconClick();
					e.stopPropagation();
				}}
			>
				<SearchIcon />
			</div>
			<input
				ref={inputRef}
				className="w-[100%] outline-none text-large"
				type="text"
				value={input}
				onChange={handler}
				onClick={(e) => {
					handleIconClick();
					e.stopPropagation();
				}}
			/>

			<div onClick={handleClearClick}>{show && <CrossIcon size={15} />}</div>

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
