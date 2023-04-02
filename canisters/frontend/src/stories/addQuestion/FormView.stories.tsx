import React from "react";
import { Meta } from "@storybook/react";
import FormView from "../../components/addQuestion/FormView";

export default {
	title: "addQuestion/Form View",
	component: FormView,
} as Meta;

const inputs = {
	title: "",
	content: "",
	reward: 0,
	duration: 1,
	validation: {
		validTitle: true,
	},
};

const specifications = {
	title: {
		min: 10,
		max: 100,
	},
};

const dispatch = {
	title: (value: string) => console.log(value),
	duration: (value: number) => console.log(value),
	reward: (value: number) => console.log(value),
	content: (value: string) => console.log(value),
};

const Template = (args) => <FormView {...args} />;

export const Default = Template.bind({});
Default.args = {
	inputs,
	specifications,
	titlePlaceholder: "What is your question?",
	dispatch,
};
