import React from "react";

export const Slider = (props) => {
	const { value, onChange, min, max, step } = props;

	const handleChange = (event) => {
		onChange(parseFloat(event.target.value));
	};

	return (
		/* Maybe relative div wrapping it is necessary */
		<div>
			<input
				type="range"
				value={value}
				min={min}
				max={max}
				step={step}
				onChange={handleChange}
				className="w-full h-1 bg-gray-100 rounded-full appearance-none cursor-pointer accent-gray-800"
			/>
		</div>
	);
};

export const SliderLabel = ({ left, right }) => {
	return (
		<div className="flex justify-between gap-4 mb-5">
			<div className="">
				<div className="flex justify-between gap-4 mb-5">{left}</div>
			</div>
			<div>{right}</div>
		</div>
	);
};
