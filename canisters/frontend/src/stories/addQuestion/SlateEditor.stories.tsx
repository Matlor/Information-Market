import React, { useState } from "react";
import { Meta } from "@storybook/react";
import {
	SlateEditor,
	TollbarInstance,
	EditableInstance,
} from "../../components/addQuestion/SlateEditor";
import Drag from "../../components/question/Drag";

export default {
	title: "addQuestion/SlateEditor",
	component: SlateEditor,
} as Meta;

const Template = (args) => {
	const [inputValue, setInputValue] = useState("");

	return (
		<Drag>
			<SlateEditor
				{...args}
				inputValue={inputValue}
				setInputValue={setInputValue}
			>
				<TollbarInstance />
				<EditableInstance placeholder="Answer..." scroll={true} />
			</SlateEditor>
		</Drag>
	);
};

export const Default = Template.bind({});
Default.args = {
	placeholder: "Type something here...",
};

export const DragStory = (args) => {
	const [inputValue, setInputValue] = useState("");

	// PAIN!!!!
	return (
		<Drag>
			<SlateEditor
				{...args}
				inputValue={inputValue}
				setInputValue={setInputValue}
				className="max-h-full p-6 border-2"
			>
				<TollbarInstance />
				<EditableInstance
					placeholder="Answer..."
					scroll={true}
					className="max-h-full p-6 overflow-y-scroll border-2"
				/>
			</SlateEditor>
		</Drag>
	);
};
