import React, { useState } from "react";
import PropTypes from "prop-types";

import { ArrowIcon } from "./Icons";
import Loading from "./Loading";

// the conditional stuff could be way simpler
const Button = ({ size, arrow, color, onClick = () => {}, loader, text }) => {
	const [loading, setLoading] = useState(false);
	const isAsync = onClick.constructor.name === "AsyncFunction";

	const handleClick = async () => {
		if (isAsync) {
			setLoading(true);
			await onClick();
			setLoading(false);
		} else {
			onClick();
		}
	};

	const sizeClass =
		size === "sm"
			? "text-extra-small px-3 py-2"
			: "text-large leading-lg py-1 px-5";
	const colorClassMap = {
		gray: "bg-gray-100 text-black",
		black: "bg-black text-white",
		none: "bg-transparent text-black",
	};
	const colorClasses = colorClassMap[color] || "bg-transparent text-black";

	return (
		<button
			onClick={handleClick}
			className={`flex items-center font-600 rounded-full ${sizeClass} ${colorClasses} focus:outline-none`}
			disabled={loading}
		>
			{!loading ? (
				<div className="flex items-baseline gap-3 ">
					{text}
					{arrow && (
						<ArrowIcon
							size={size === "sm" ? 8 : 10}
							strokeWidth={3}
							borderColor={"white"}
						/>
					)}
				</div>
			) : (
				<div className="flex items-center space-x-3">
					{loader ? <>{loader}</> : <Loading />}
				</div>
			)}
		</button>
	);
};

Button.propTypes = {
	size: PropTypes.oneOf(["sm", "lg"]),
	arrow: PropTypes.bool,
	color: PropTypes.oneOf(["none", "gray", "black"]),
	onClick: PropTypes.func.isRequired,
	loader: PropTypes.node,
	text: PropTypes.node.isRequired,
};

Button.defaultProps = {
	size: "sm",
	arrow: false,
	color: "none",
	loader: null,
};

export default Button;
