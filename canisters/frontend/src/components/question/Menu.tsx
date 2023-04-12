import React from "react";
import Button from "../core/Button";

type MenuProps = {
	text: string;
	onClick?: (...args: any[]) => void;
	time?: React.ReactNode;
};

const Menu = ({ text, onClick, time }: MenuProps) => {
	return (
		<div
			data-cy="menu"
			className="flex flex-col justify-between w-1/2 h-10 p-5 shadow-md rounded-2"
		>
			<div className="self-end text-sm text-gray-500 ">{time && time}</div>
			<div className="flex items-center justify-between">
				<div className="text-small">{text}</div>
				{onClick && (
					<Button
						onClick={onClick}
						text="Confirm"
						size="sm"
						color="gray"
						arrow={true}
					/>
				)}
			</div>
		</div>
	);
};

export default Menu;
