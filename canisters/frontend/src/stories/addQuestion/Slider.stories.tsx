import React, { useState } from "react";
import { Slider, SliderLabel } from "../../components/addQuestion/Slider";

export default {
	title: "addQuestion/Slider",
	subcomponents: { Slider, SliderLabel },
};

const Template = (args) => {
	const [value, setValue] = useState(args.value);
	const handleChange = (newValue) => {
		setValue(newValue);
	};
	return <Slider {...args} value={value} onChange={handleChange} />;
};

export const Default = Template.bind({});
Default.args = {
	min: 0,
	max: 10,
	step: 0.1,
};

export const WithLabel = () => {
	const [value, setValue] = useState(0);
	const handleChange = (newValue) => {
		setValue(newValue);
	};
	return (
		<>
			<SliderLabel left="Minimum Value" right="Maximum Value" />
			<Slider
				value={value}
				min={0}
				max={10}
				step={0.1}
				onChange={handleChange}
			/>
		</>
	);
};
