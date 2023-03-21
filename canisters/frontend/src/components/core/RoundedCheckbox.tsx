import React from "react";

interface IRoundedCheckox {
	isChecked: boolean;
}

const RoundedCheckox = ({ isChecked }: IRoundedCheckox) => {
	return (
		<div className="border-colorIcon rounded-full w-[16px] h-[16px] relative">
			<div
				className={`w-[8px] h-[8px] ${
					isChecked ? "bg-colorIcon" : ""
				} rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 `}
			></div>
		</div>
	);
};

export default RoundedCheckox;
