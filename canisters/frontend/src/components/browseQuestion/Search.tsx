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
	const [show, setShow] = useState<boolean>(false);

	const handler = (e) => {
		setInput(e.target.value);
		setSearchedText(e.target.value);
	};

	const handleIconClick = () => {
		inputRef.current.focus();
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

	console.log(show, "show");
	// "shadow-[0px_2px_0px_rgba(0,0,0,0.9)]"
	return (
		<div
			className={`pb-1 relative max-w-[270px]w-full flex gap-[25px] justify-center items-center box-border ${
				show && ""
			} `}
			onClick={(e) => {
				handleIconClick();
				e.stopPropagation();
			}}
		>
			<div
				className={`items-center rounded-full p-3 ${
					!show ? "cursor-pointer bg-colorLines " : "bg-colorIcon"
				} `}
			>
				<SearchIcon size={16} />
			</div>
			<input
				ref={inputRef}
				className="w-[100%] outline-none placeholder:text-normal text-normal"
				type="text"
				placeholder=""
				value={input}
				onChange={handler}
			/>

			<div onClick={handleClearClick}>{show && <ClearIcon />}</div>

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

/* 

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
	const [show, setShow] = useState<boolean>(false);

	const handler = (e) => {
		setInput(e.target.value);
		setSearchedText(e.target.value);
	};

	const handleIconClick = () => {
		inputRef.current.focus();
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

	console.log(show, "show");
	// "shadow-[0px_2px_0px_rgba(0,0,0,0.9)]"
	return (
		<div
			className={`pb-1 relative max-w-[270px]w-full flex gap-[25px] justify-center items-center box-border ${
				show && ""
			} `}
			onClick={(e) => {
				handleIconClick();
				e.stopPropagation();
			}}
		>
			<div
				className={`items-center rounded-full p-3 ${
					!show ? "cursor-pointer bg-colorLines " : "bg-colorIcon"
				} `}
			>
				<SearchIcon size={16} />
			</div>
			<input
				ref={inputRef}
				className="w-[100%] outline-none placeholder:text-normal text-normal"
				type="text"
				placeholder=""
				value={input}
				onChange={handler}
			/>

			<div onClick={handleClearClick}>{show && <ClearIcon />}</div>

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








*/
