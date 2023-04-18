import React, { useRef, useEffect, useContext, useState } from "react";
import { ActorContext } from "../api/Context";
import Footer from "./Footer";
import PageWidthContext from "./PageContext";

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

	return (
		<div
			className={`min-h-screen flex flex-col items-center overflow-y-visible w-full p-4 md:p-5 xl:py-7`}
		>
			{Header}
			<div
				className="max-w-[900px] w-full flex flex-col justify-between gap-9 my-9 flex-grow"
				ref={pageRef}
				style={{ "--page-width": "100%" }} //
			>
				{children}
			</div>
		</div>
	);
};

const List = ({ children }) => {
	return (
		/* with and below sort menu */
		<div className="flex flex-col justify-center gap-9 sm:gap-9">
			{children}
		</div>
	);
};

export { List, Page };
//overflow-x-hidden
