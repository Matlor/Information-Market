import React, { useState, useRef, useEffect } from "react";

const Picker = ({ label, value, setValue }) => {
	const elementWidth = 50; // width of each element in pixels
	const [thing, setThing] = useState({
		value: 0,
		startY: null,
		dragging: false,
	});

	const [scrollX, setScrollX] = useState(0);
	const elementRef = useRef(null);

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
			const newHeight = thing.value + delta / 10;

			setThing({
				...thing,
				value: newHeight,
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

	// --------------- UI ---------------

	return (
		<div className="flex flex-col items-center mx-4">
			<div className="text-xl font-bold mb-2">{label}</div>
			<div
				className="select-none w-32 h-48 border-2 py-10 bg-gray-200 rounded-lg flex flex-col gap-10 items-center justify-center relative"
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
				onMouseMove={handleMouseMove}
				style={{
					overflow: "hidden",
				}}
				ref={elementRef}
			>
				{Math.round(thing.value)}
			</div>
		</div>
	);
};

const TimePicker = () => {
	const [hours, setHours] = useState(12);
	const [days, setDays] = useState(12);
	const [reward, setReward] = useState(12);

	return (
		<div className="flex items-center justify-center">
			<Picker label="Reward" value={reward} setValue={setReward} />

			<Picker label="Hours" value={hours} setValue={setHours} />
			<Picker label="Days" value={days} setValue={setDays} />
		</div>
	);
};

export default TimePicker;
