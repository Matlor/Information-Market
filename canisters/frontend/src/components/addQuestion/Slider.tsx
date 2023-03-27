import React from "react";

function Slider(props) {
	const { value, min, max, step, onChange, label, displayValue } = props;

	const handleChange = (event) => {
		onChange(parseFloat(event.target.value));
	};

	return (
		<div>
			<div className="flex justify-between gap-4 mb-5">
				<div className="text-colorTextGrey">{label}</div>
				{displayValue}
			</div>
			<div className="relative w-full h-8">
				<input
					type="range"
					value={value}
					min={min}
					max={max}
					step={step}
					onChange={handleChange}
					className="accent-colorRed w-full h-[2px] bg-colorLines rounded-full appearance-none cursor-pointer"
				/>
			</div>
		</div>
	);
}

export default Slider;
