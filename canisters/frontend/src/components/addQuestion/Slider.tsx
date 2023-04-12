import React from "react";

export const Slider = ({ value, onChange, min, max, step, disabled }) => {
	const handleChange = (event) => {
		onChange(parseFloat(event.target.value));
	};

	return (
		<input
			type="range"
			value={value}
			min={min}
			max={max}
			step={step}
			onChange={handleChange}
			className="flex w-full h-1 bg-gray-100 rounded-full appearance-none cursor-pointer accent-gray-800"
			disabled={disabled}
		/>
	);
};

export const SliderLabel = ({ left, right }) => {
	return (
		<div className="flex gap-4 text-small">
			<div>{left}</div>
			<div>{right}</div>
		</div>
	);
};
