import React, { useState, useRef, useEffect } from "react";

const Selector = ({ value, setValue }) => {
	const [isDragging, setIsDragging] = useState(false);
	const dragStartX = useRef(0);
	const dragStartValue = useRef(value);

	const handleDragStart = (e) => {
		e.preventDefault();
		setIsDragging(true);
		dragStartX.current =
			e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
		dragStartValue.current = value;
	};

	const handleDragMove = (e) => {
		if (!isDragging) return;
		const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
		const dragDistance = clientX - dragStartX.current;
		const valueDistance = Math.round(dragDistance / 10);
		setValue(dragStartValue.current + valueDistance);
	};

	const handleDragEnd = () => {
		setIsDragging(false);
	};

	useEffect(() => {
		// Prevent scrolling while slider is being dragged
		const handleTouchMove = (e) => {
			if (isDragging) {
				e.preventDefault();
			}
		};

		document.addEventListener("touchmove", handleTouchMove, {
			passive: false,
		});

		return () => {
			document.removeEventListener("touchmove", handleTouchMove);
		};
	}, [isDragging]);

	return (
		<div className="w-1/2 px-5 relative flex flex-col justify-center">
			<div className="mb-5 text-center text-small">value: {value}</div>
			<div
				onMouseDown={handleDragStart}
				onTouchStart={handleDragStart}
				onMouseMove={handleDragMove}
				onTouchMove={handleDragMove}
				onMouseUp={handleDragEnd}
				onTouchEnd={handleDragEnd}
				onTouchCancel={handleDragEnd}
				className="w-full h-10 overflow-hidden flex items-center justify-center relative select-none cursor-pointer"
				style={{
					background: `
          linear-gradient(to right, 
            transparent 0%, 
            transparent calc(50% - 2.5px), 
            #F5F5F5 calc(50% - 2.5px), 
            #F5F5F5 50%, 
            transparent 50%, 
            transparent 100%)
          ${value}px 50% / 40px 50% repeat-x
        `,
				}}
			>
				<div className="absolute top-1/2 left-1/2 bg-colorRed h-12 w-[4px] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
			</div>
		</div>
	);
};

export default Selector;
