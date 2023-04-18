// Draggable.stories.js
import React from "react";
import { Draggable, Drag } from "../../components/question/Drag";

export default {
	title: "question/Drag",
	component: Draggable,
};

const Template = (args) => (
	<Draggable {...args} className="border-2 ">
		{({ handleMouseDown }) => (
			<>
				<Drag handleMouseDown={handleMouseDown} className="pt-3 mb-6 border-2">
					<h1>Content inside the Drag component</h1>
				</Drag>
				<p>Content outside the Drag component</p>
			</>
		)}
	</Draggable>
);

export const Default = Template.bind({});
Default.args = {
	className: "",
};
