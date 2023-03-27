import React from "react";
import { DefaultButton } from "../core/Button";

// TODO: Make named export
const Menu = ({ selected, confirmFunc }) => {
	if (selected) {
		return (
			<div data-cy="menu">
				Selected Menu: Confirm your selection
				<div> Time Left:</div>
				<DefaultButton propFunction={confirmFunc} text="Confirm" />
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
