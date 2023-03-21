import React from "react";
import Button from "../core/Button";

const Menu = ({ selected, confirmFunc }) => {
	if (selected) {
		return (
			<div data-cy="menu">
				Selected Menu: Confirm your selection
				<div> Time Left:</div>
				<Button propFunction={confirmFunc} text="Confirm" />
			</div>
		);
	} else {
		return (
			<div className="text-normal">
				Pick Menu: Select the best answer
				<div> Time Left:</div>
			</div>
		);
	}
};

export default Menu;
