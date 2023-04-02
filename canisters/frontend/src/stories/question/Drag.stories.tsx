import React from "react";
import { Meta } from "@storybook/react";
import Drag from "../../components/question/Drag";

export default {
	title: "question/Drag",
	component: Drag,
} as Meta;

const Template = (args) => (
	<Drag {...args}>
		<div className="p-4">
			<p>Content inside draggable container.</p>
		</div>
	</Drag>
);

export const Default = Template.bind({});
