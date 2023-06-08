import React, { useRef, useEffect, useState } from "react";

const Page = ({ children, Header }) => {
	const pageRef = useRef(null);
	const [pageWidth, setPageWidth] = useState(0);

	useEffect(() => {
		const handleResize = () => {
			if (pageRef.current) {
				const newPageWidth = pageRef.current.clientWidth;
				setPageWidth(newPageWidth);
			}
		};

		handleResize(); // Call once on mount
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	useEffect(() => {
		if (pageRef.current) {
			pageRef.current.style.setProperty("--page-width", `${pageWidth}px`);
		}
	}, [pageWidth]);

	const pagePadding = "px-4 md:px-5";

	return (
		<>
			<Header pagePadding={pagePadding} />

			<div
				className={`max-w-[750px] min-h-screen w-full flex flex-col mb-9 ${pagePadding}`}
				ref={pageRef}
				style={{ "--page-width": "100%" }}
			>
				{children}
			</div>
		</>
	);
};

const List = ({ children }) => {
	return (
		<div className="flex flex-col justify-center gap-[80px]">{children}</div>
	);
};

export { List, Page };
//overflow-x-hidden
