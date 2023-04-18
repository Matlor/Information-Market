import React from "react";
import { Meta, Story } from "@storybook/react";
import { Pic1, ShapeGrid } from "../../components/core/TestPicture";

export default {
	title: "core/TestPicture",
	component: Pic1,
	argTypes: {
		principal: { control: "text" },
		size: { control: "number" },
	},
} as Meta;

const Template: Story<any> = (args) => <ShapeGrid {...args} />;

export const Pic1Story = Template.bind({});
Pic1Story.args = {
	uniqueString: "aa",
	size: 32,
};

/* 
export const Pic2Story = Template.bind({});
Pic2Story.args = {
	str: "kerjbgerkjjjkbrekjrbkbekjb",
	size: 32,
}; */
