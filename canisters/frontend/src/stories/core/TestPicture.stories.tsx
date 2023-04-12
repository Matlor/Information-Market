import React from "react";
import { Meta, Story } from "@storybook/react";
import { TestPicture } from "../../components/core/Profile";
import { Principal } from "@dfinity/principal";

export default {
	title: "core/TestPicture",
	component: TestPicture,
	argTypes: {
		principal: { control: "text" },
		size: { control: "number" },
	},
} as Meta;

const Template: Story<any> = (args) => <TestPicture {...args} />;

export const TestPictureStory = Template.bind({});
TestPictureStory.args = {
	str: "kerjbgerkjjjkbrekjrbkbekjb",
	size: 32,
};
