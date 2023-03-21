import React from "react";
import { IconButtonArrowRight } from "./Icons";

const ButtonArrow = ({ isSelected = false, text }) => {
	return (
		<div
			data-cy="ArrowButton"
			className={`w-[200px] h-[44px] px-[20px] flex justify-between items-center relative bg-colorBackgroundComponents rounded-md`}
		>
			<div className={`text-normal ${isSelected ? "" : "opacity-[0.5]"}`}>
				{text}
			</div>
			<div className={`${isSelected ? "" : "opacity-[0.5]"}`}>
				<IconButtonArrowRight />
			</div>
		</div>
	);
};

export default ButtonArrow;
