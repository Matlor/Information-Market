import React from "react";

const ListWrapper = ({ children }) => {
	return (
		<div className="flex flex-col justify-center gap-[17px] p-0 self-stretch border-2">
			{children}
		</div>
	);
};

export default ListWrapper;
