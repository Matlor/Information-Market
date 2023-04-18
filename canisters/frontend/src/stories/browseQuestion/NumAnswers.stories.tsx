import React from "react";
import NumAnswers from "../../components/browseQuestion/NumAnswers";

export default {
	title: "browseQuestion/NumAnswers",
	component: NumAnswers,
};

const Template = (args) => (
	<div className="flex gap-2 text-extra-small">
		some text
		<NumAnswers {...args} />{" "}
	</div>
);

export const Default = Template.bind({});
Default.args = {
	number: 5,
};
