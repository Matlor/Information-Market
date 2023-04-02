import React, { useState } from "react";
import { Story } from "@storybook/react";
import { SlateEditor } from "../../components/addQuestion/SlateEditor";

export default {
	title: "addQuestion/SlateEditor",
	component: SlateEditor,
};

const Template: Story = (args) => {
	const [inputValue, setInputValue] = useState("");
	return (
		<SlateEditor
			inputValue={inputValue}
			setInputValue={setInputValue}
			placeholder="Enter some text"
		/>
	);
};

export const Default = Template.bind({});
