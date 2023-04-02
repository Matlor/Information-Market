import React from "react";
import { Meta, Story } from "@storybook/react";
import Modal from "../../components/core/Modal";

export default {
	title: "core/Modal",
	component: Modal,
	argTypes: {
		view: {
			control: false,
		},
		children: {
			control: false,
		},
	},
} as Meta;

const Template: Story = (args) => (
	<Modal {...args} view={<div>Modal</div>}>
		<div className="text-black rounded-md w-max bg-red">n</div>
	</Modal>
);

export const Default = Template.bind({});
Default.args = {};
