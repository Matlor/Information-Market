import React from "react";

// TODO: correct color
const Settings = () => {
	return (
		<div data-cy="settings" className="self-center ">
			<svg
				width="4"
				height="20"
				viewBox="0 0 4 20"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<circle
					cx="2"
					cy="10"
					r="2"
					transform="rotate(-90 2 10)"
					fill="#0F1318"
				/>
				<circle
					cx="2"
					cy="18"
					r="2"
					transform="rotate(-90 2 18)"
					fill="#0F1318"
				/>
				<circle
					cx="2"
					cy="2"
					r="2"
					transform="rotate(-90 2 2)"
					fill="#0F1318"
				/>
			</svg>
		</div>
	);
};

export default Settings;
