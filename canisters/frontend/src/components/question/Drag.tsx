import React, { useState, useEffect } from "react";

const Editor = ({ children }) => {
	const [thing, setThing] = useState({
		height: 100,
		startY: null,
		dragging: false,
	});

	function handleMouseDown(event) {
		setThing({
			...thing,
			dragging: true,
			startY: event.clientY,
		});
	}

	function handleMouseUp() {
		setThing({
			...thing,
			dragging: false,
		});
	}

	function handleMouseMove(event) {
		if (thing.dragging) {
			const delta = thing.startY ? thing.startY - event.clientY : 0;
			const newHeight = thing.height + delta;
			const minHeight = 50;
			const maxHeight = window.innerHeight - 50;
			const clampedHeight = Math.min(maxHeight, Math.max(minHeight, newHeight));

			setThing({
				...thing,
				height: clampedHeight,
				startY: event.clientY,
			});
		}
	}

	useEffect(() => {
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [thing]);

	// TODO: left and width should be related to the layout border or something
	return (
		<div className="">
			<div
				data-cy="drag"
				className="rounded-t-md drop-shadow-[0_-1px_10px_rgba(0,0,0,0.1)]"
				style={{
					position: "fixed",
					maxWidth: "800px",
					width: "100%",
					bottom: 0,
					left: "50%",
					transform: "translateX(-50%)",
					height: `${thing.height}px`,
					backgroundColor: "#FFFFFF",
					cursor: thing.dragging ? "ns-resize" : "default",
				}}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
			>
				<div className="h-full">{children}</div>
			</div>
		</div>
	);
};

export default Editor;
