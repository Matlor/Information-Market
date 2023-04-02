import React from "react";
import ListWrapper from "../../components/app/ListWrapper";

export default {
	title: "app/ListWrapper",
	component: ListWrapper,
};

const Template = (args) => (
	<ListWrapper {...args}>
		<div className="border-2">List item 1</div>
		<div className="border-2">List item 2</div>
		<div className="border-2">List item 3</div>
	</ListWrapper>
);

export const Default = Template.bind({});
Default.args = {};
