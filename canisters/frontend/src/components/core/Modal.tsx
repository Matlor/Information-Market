import React, { useState } from "react";

const Modal = ({ children, view, className = "" }) => {
	const [display, setDisplay] = useState(false);

	window.addEventListener("click", () => {
		if (display) {
			setDisplay(false);
		}
	});

	return (
		<div className="relative w-max">
			<button
				className="w-full"
				onClick={(e) => {
					setDisplay(!display);
					e.stopPropagation();
				}}
			>
				{view ? view : <div></div>}
			</button>
			{display && (
				<div
					className={`absolute shadow-lg right-[0px] ${className}`}
					onClick={(e) => {
						e.stopPropagation();
					}}
				>
					{children}
				</div>
			)}
		</div>
	);
};

export default Modal;
