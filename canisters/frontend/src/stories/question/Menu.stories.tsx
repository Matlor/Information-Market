import React from "react";
import { Meta, Story } from "@storybook/react";
import Menu from "../../components/question/Menu";
import Button from "../../components/core/Button";
import { TimeLeft } from "../../components/core/Time";

export default {
	title: "question/Menu",
	component: Menu,
} as Meta;

const Template: Story = (args) => <Menu {...args} />;

export const Default = Template.bind({});
Default.args = {
	text: "This is a sample menu",
	button: (
		<Button
			size={"sm"}
			onClick={() => {}}
			arrow={true}
			text="Confirm"
			color="black"
		/>
	),
	time: <TimeLeft minutes={Math.floor(Date.now() / 1000) / 60 + 10} />,
};

export const NoButton = Template.bind({});
NoButton.args = {
	text: "Select the best answer",
	time: <TimeLeft minutes={Math.floor(Date.now() / 1000) / 60 + 10} />,
};

export const NoTime = Template.bind({});
NoTime.args = {
	text: "Confirm your choice",
	button: (
		<Button
			size={"sm"}
			onClick={() => {}}
			arrow={true}
			text="Confirm"
			color="black"
		/>
	),
};
