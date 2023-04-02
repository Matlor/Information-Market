import React from "react";

// TODO: Make named export
// selected, confirmFunc
const Menu = ({ text, button, time }) => {
	return (
		<div
			data-cy="menu"
			className="flex flex-col gap-6 p-5 border-2 rounded-1 w-11"
		>
			<div className="self-end">
				{time && <div className="text-sm text-gray-500 ">{time}</div>}
			</div>
			<div className="flex items-baseline justify-between">
				<div>{text}</div>
				{button && <button className="">{button}</button>}
			</div>
		</div>
	);
};

export default Menu;

/* if (selected) {
		return (
			<div data-cy="menu">
				Selected Menu: Confirm your selection
				<div> Time Left:</div>
				<Button onClick={confirmFunc} text="Confirm" />
			</div>
		);
	} else {
		return (
			<div className="text-normal">
				Pick Menu: Select the best answer
				<div> Time Left:</div>
			</div>
		);
	} */
