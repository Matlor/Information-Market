import React from "react";
import { LinkIcon } from "../core/Icons";

const Tag = ({ option = "selected", children }) => {
	const renderContent = () => {
		switch (option) {
			case "winner":
				return (
					<>
						<div className="text-number"> + {children}</div>
						<div className="self-center">
							<LinkIcon />
						</div>
					</>
				);
			case "selected":
				return <>SELECTED</>;
			default:
				return null;
		}
	};

	return (
		<div
			data-cy="tag"
			className="flex gap-2 text-normal bg-colorLines py-1 px-2"
		>
			{renderContent()}
		</div>
	);
};

export default Tag;
