import React, { useState } from "react";
import { Meta } from "@storybook/react";
import {
	SlateEditor,
	TollbarInstance,
	EditableInstance,
} from "../../components/addQuestion/SlateEditor";
import { Draggable, Drag } from "../../components/question/Drag";

export default {
	title: "addQuestion/SlateEditor",
	component: SlateEditor,
} as Meta;

const Template = (args) => {
	const [inputValue, setInputValue] = useState("");

	return (
		<Draggable className="flex flex-col border-2 p-7">
			{({ handleMouseDown }) => (
				<>
					<Drag handleMouseDown={handleMouseDown} className="flex-shrink-0">
						<div className="bg-gray-100">drag</div>
					</Drag>
					<SlateEditor
						{...args}
						inputValue={inputValue}
						setInputValue={setInputValue}
						className="flex flex-col flex-grow h-full"
					>
						<TollbarInstance />

						<EditableInstance
							placeholder="Answer..."
							className="max-h-full !min-h-[20px] overflow-scroll border-2 "
						/>
					</SlateEditor>
				</>
			)}
		</Draggable>
	);
};

export const Default = Template.bind({});
Default.args = {
	placeholder: "Type something here...",
};

export const Drag2Story = (args) => {
	const [inputValue, setInputValue] = useState("");

	// PAIN!!!!
	return (
		<Draggable className="p-3 border-2">
			{({ handleMouseDown }) => (
				<>
					<Drag handleMouseDown={handleMouseDown}>
						<div>drag</div>
					</Drag>
					<div className="h-full bg-red">
						Slate editor
						<div className="border-2">editable</div>
					</div>
				</>
			)}
		</Draggable>
	);
};

/* 
<SlateEditor
						{...args}
						inputValue={inputValue}
						setInputValue={setInputValue}
						className="p-3 border-2"
					>
						<TollbarInstance />
						<EditableInstance placeholder="Answer..." scroll={true} />
					</SlateEditor>

*/
