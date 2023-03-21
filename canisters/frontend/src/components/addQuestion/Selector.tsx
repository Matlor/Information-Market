import React, { useState, useRef } from "react";

const Selector = () => {
	const [scrollX, setScrollX] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const dragStartX = useRef(0);

	const handleMouseDown = (e) => {
		e.preventDefault();
		setIsDragging(true);
		dragStartX.current = e.clientX;
	};

	const handleMouseMove = (e) => {
		if (!isDragging) return;
		const deltaX = e.clientX - dragStartX.current;
		setScrollX((prev) => prev + deltaX);
		dragStartX.current = e.clientX;
	};

	const handleMouseUp = () => {
		setIsDragging(false);
	};

	const handleMouseLeave = () => {
		setIsDragging(false);
	};

	const handleTouchStart = (e) => {
		setIsDragging(true);
		dragStartX.current = e.touches[0].clientX;
	};

	const handleTouchMove = (e) => {
		if (!isDragging) return;
		const deltaX = e.touches[0].clientX - dragStartX.current;
		setScrollX((prev) => prev + deltaX);
		dragStartX.current = e.touches[0].clientX;
	};

	const handleTouchEnd = () => {
		setIsDragging(false);
	};

	const selectedValue = Math.round(scrollX / 40);

	return (
		<div className="w-full px-10 relative flex flex-col justify-center">
			<div className="mb-10 text-center">Selected: {selectedValue}</div>
			<div
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onMouseLeave={handleMouseLeave}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
				className="w-full h-20 overflow-hidden flex items-center justify-center relative select-none cursor-pointer"
				style={{
					background: `
					linear-gradient(to right, 
					  transparent 0%, 
					  transparent calc(50% - 5px), 
					  #F5F5F5 calc(50% - 5px), 
					  #F5F5F5 50%, 
					  transparent 50%, 
					  transparent 100%)
					${scrollX}px 50% / 80px 50% repeat-x
				  `,
				}}
			>
				{/* <div
					className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
					style={{ transform: `translateX(${scrollX}px)` }}
				></div> */}
				<div className="absolute top-1/2 left-1/2 bg-colorRed h-24 w-[8px] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
			</div>
		</div>
	);
};

export default Selector;
<div className="bg-colorDark h-8 w-0.5 mr-4"></div>;
