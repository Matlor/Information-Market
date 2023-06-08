import React, { useState, useRef } from "react";
import { SearchIcon, CrossIcon } from "../core/Icons";

interface ISearch {
	setSearchedText: (text: any) => void;
	className?: string;
}

const Search = ({ setSearchedText, className = "" }: ISearch) => {
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
		<div className={`cursor-pointer relative  ${show && ""} ${className}`}>
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
				className={`outline-none w-0 text-large placeholder:text-gray-500 !font-300 ${
					show ? "w-10" : "w-0"
				}`}
				type="text"
				value={input}
				placeholder=""
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
		</div>
	);
};

export default Search;
