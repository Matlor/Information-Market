import React, { useState, useEffect } from "react";

const Draggable = ({ children, className = "" }) => {
	const [thing, setThing] = useState({
		height: 100,
		startY: null,
		dragging: false,
	});

	useEffect(() => {
		function handleMouseMove(event) {
			if (thing.dragging) {
				const delta = thing.startY ? thing.startY - event.clientY : 0;
				const newHeight = thing.height + delta;
				const minHeight = 50;
				const maxHeight = window.innerHeight - 50;
				const clampedHeight = Math.min(
					maxHeight,
					Math.max(minHeight, newHeight)
				);

				setThing({
					...thing,
					height: clampedHeight,
					startY: event.clientY,
				});
			}
		}

		function handleMouseUp() {
			setThing({
				...thing,
				dragging: false,
			});
		}

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [thing]);

	const handleMouseDown = (event) => {
		setThing({
			...thing,
			dragging: true,
			startY: event.clientY,
		});
	};

	return (
		<div
			className={`rounded-t-2  drop-shadow-[0_-1px_4px_rgba(0,0,0,0.1)] ${className}`}
			style={{
				/* position: "fixed",
				maxWidth: "800px",
				width: "100%",
				bottom: 0,
				left: "50%",
				backgroundColor: "#FFFFFF",
				transform: "translateX(-50%)", */

				height: `${thing.height}px`,
			}}
		>
			{children({ thing, handleMouseDown })}
		</div>
	);
};

const Drag = ({ children, handleMouseDown, className = "" }) => {
	return (
		<div
			className={`${className} cursor-pointer`}
			onMouseDown={handleMouseDown}
		>
			{children}
		</div>
	);
};

export { Draggable, Drag };
