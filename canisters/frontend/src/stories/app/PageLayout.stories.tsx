import React from "react";
import PageLayout from "../../components/app/PageLayout";

export default {
	title: "app/PageLayout",
	component: PageLayout,
};

const Template = (args) => <PageLayout {...args} />;

export const Default = Template.bind({});
Default.args = {
	children: (
		<>
			<h1>Layout</h1>
		</>
	),
};
