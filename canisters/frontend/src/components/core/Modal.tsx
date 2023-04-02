import React, { useState } from "react";

const Modal = ({ children, view }) => {
	const [display, setDisplay] = useState(false);

	window.addEventListener("click", () => {
		console.log("event handler");
		if (display) {
			setDisplay(false);
		}
	});

	return (
		<div className="relative w-max">
			<button
				className="w-full"
				onClick={(e) => {
					console.log("click");
					setDisplay(!display);
					e.stopPropagation();
				}}
			>
				{view ? view : <div></div>}
			</button>
			{display && (
				<div
					className="absolute right-0 shadow-lg"
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
