import React, { useState, useRef, useEffect } from "react";

const FixedWidthWrapper = ({ children }) => {
	const contentRef = useRef(null);
	const [wrapperWidth, setWrapperWidth] = useState(null);

	useEffect(() => {
		if (contentRef.current) {
			setWrapperWidth(contentRef.current.offsetWidth);
		}
	}, [contentRef]);

	return (
		<div
			className="flex items-center justify-center w-max"
			style={{
				width: wrapperWidth,
				overflow: "hidden",
			}}
		>
			<div ref={contentRef}>{children}</div>
		</div>
	);
};

export default FixedWidthWrapper;
