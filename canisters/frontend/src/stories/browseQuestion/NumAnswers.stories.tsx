import React from "react";
import NumAnswers from "../../components/browseQuestion/NumAnswers";

export default {
	title: "browseQuestion/NumAnswers",
	component: NumAnswers,
};

const Template = (args) => <NumAnswers {...args} />;

export const Default = Template.bind({});
Default.args = {
	number: 5,
};
