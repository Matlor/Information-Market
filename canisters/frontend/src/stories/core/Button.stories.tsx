import React from "react";
import { Meta, Story } from "@storybook/react";
import Button from "../../components/core/Button";

export default {
	title: "core/Button",
	component: Button,
	argTypes: {
		size: {
			options: ["sm", "lg"],
			control: { type: "radio" },
		},
		arrow: { control: "boolean" },
		color: {
			options: ["none", "gray", "black"],
			control: { type: "radio" },
		},
		onClick: { action: "clicked" },
	},
} as Meta;

const Template: Story = (args) => <Button {...args} />;

export const Small = Template.bind({});
Small.args = {
	size: "sm",
	arrow: false,
	color: "none",
	text: "Login",
};

export const Large = Template.bind({});
Large.args = {
	size: "lg",
	arrow: false,
	color: "none",
	text: "Login",
};

export const WithArrow = Template.bind({});
WithArrow.args = {
	size: "sm",
	arrow: true,
	color: "none",
	text: "Login",
};

export const Grey = Template.bind({});
Grey.args = {
	size: "sm",
	arrow: false,
	color: "gray",
	text: "Login",
};

export const Black = Template.bind({});
Black.args = {
	size: "sm",
	arrow: false,
	color: "black",
	text: "Login",
};
