import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";

import TitleInput from "../../components/addQuestion/TitleInput";

export default {
	title: "addQuestion/TitleInput",
	component: TitleInput,
} as Meta;

const Template: Story<any> = (args) => {
	const [value, setValue] = useState("");
	const Validity = {
		isValid: true,
		invalidMessage: "Title is invalid",
	};
	return (
		<TitleInput
			{...args}
			value={value}
			setValue={setValue}
			Validity={Validity}
		/>
	);
};

export const Default = Template.bind({});
Default.args = {
	placeholder: "Enter a title",
	maxLength: 100,
};

export const Invalid = Template.bind({});
Invalid.args = {
	placeholder: "Enter a title",
	maxLength: 100,
	Validity: {
		isValid: false,
		invalidMessage: "Title should be at least 10 characters",
	},
};
