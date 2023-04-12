import React, { useState, useCallback } from "react";
import { Meta } from "@storybook/react";
import Form from "../../components/addQuestion/Form";
import { doValidation } from "../../screens/AddQuestion";

export default {
	title: "addQuestion/Form View",
	component: Form,
} as Meta;

const specifications = {
	title: {
		min: 10,
		max: 100,
	},
	duration: {
		min: 1,
		max: 24,
	},
	reward: {
		min: 0,
		max: 1000,
	},
};

const Template = (args) => {
	const [inputs, setInputs] = useState(args.inputs);

	const handleDispatch = useCallback((type, payload) => {
		setInputs((inputs) => {
			const updatedInputs = {
				...inputs,
				[type]: payload,
			};
			updatedInputs.validation = doValidation(updatedInputs, specifications);
			return updatedInputs;
		});
	}, []);

	return (
		<Form
			inputs={inputs}
			specifications={specifications}
			titlePlaceholder="What is your question?"
			dispatch={{
				title: (value) => handleDispatch("title", value),
				duration: (value) => handleDispatch("duration", value),
				reward: (value) => handleDispatch("reward", value),
				content: (value) => handleDispatch("content", value),
			}}
		/>
	);
};

export const Default = Template.bind({});
Default.args = {
	inputs: {
		validation: {
			validTitle: false,
			validDuration: false,
			validReward: false,
		},
		title: "",
		content: "",
		duration: 0,
		reward: 0,
	},
};
