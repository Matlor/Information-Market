import React from "react";

const Content = ({ title }: { title: string }) => {
	return (
		<div className="text-normal">
			{title.charAt(0).toUpperCase() + title.slice(1)}
		</div>
	);
};

export default Content;
