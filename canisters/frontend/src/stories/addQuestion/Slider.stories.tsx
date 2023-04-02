import React from "react";
import { Slider, SliderLabel } from "../../components/addQuestion/Slider";

export default {
	title: "addQuestion/Slider",
	subcomponents: { Slider, SliderLabel },
};

const Template = (args) => <Slider {...args} />;

export const Default = Template.bind({});
Default.args = {
	value: 5,
	min: 0,
	max: 10,
	step: 1,
	onChange: () => {},
};

export const WithLabel = () => (
	<>
		<SliderLabel left="Minimum Value" right="Maximum Value" />
		<Slider value={5} min={0} max={10} step={1} onChange={() => {}} />
	</>
);
