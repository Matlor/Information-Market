import React, { useCallback, useMemo } from "react";
import {
	AiOutlineBold,
	AiOutlineItalic,
	AiOutlineUnderline,
	AiOutlineOrderedList,
	AiOutlineUnorderedList,
} from "react-icons/ai";
import { RiDoubleQuotesR } from "react-icons/ri";
import isHotkey from "is-hotkey";
import { Editable, withReact, Slate, useSlate } from "slate-react";
import {
	HOTKEYS,
	resetBlocks,
	isBlockActive,
	BlockButton,
	toggleMark,
	MarkButton,
	Element,
	Leaf,
	Toolbar,
	resetMarks,
	serialize,
} from "./SlateHelpers";
import { Editor, createEditor, Element as SlateElement } from "slate";
import { withHistory } from "slate-history";
import { IconContext } from "react-icons";

/* export const resetEditor = (parentStateSetter) => {
	const editor = useSlate();
	Editor.withoutNormalizing(editor, () => {
		editor.children = initialValue;
		const point = { path: [0, 0], offset: 0 };
		editor.selection = { anchor: point, focus: point };
		editor.history = { redos: [], undos: [] };
		parentStateSetter(serialize(editor));
	});
};
 */
/* 
<button
	onClick={() => {
		console.log("hit", editor.children);
		editor.children = initialValue;
		const point = { path: [0, 0], offset: 0 };
		editor.selection = { anchor: point, focus: point };
		editor.history = { redos: [], undos: [] };
		setInputValue(serialize(editor));
	}}
>
	reset
</button>

*/

const initialValue = [
	{
		type: "paragraph",
		children: [{ text: "" }],
	},
];

export const SlateEditor = ({ setInputValue, children, className = "" }) => {
	// could I put this outside of this component?
	const editor = useMemo(() => withHistory(withReact(createEditor())), []);
	return (
		// Is about the state of an object and Slate itself provides that state to UI component further down
		<Slate
			editor={editor}
			value={initialValue}
			onChange={(value) => {
				const isAstChange = editor.operations.some(
					(op) => "set_selection" !== op.type
				);
				if (isAstChange) {
					setInputValue(serialize(editor));
				}
			}}
		>
			<div className={`${className}`}>{children}</div>
		</Slate>
	);
};

export const TollbarInstance = () => {
	const editor = useSlate();
	return (
		<IconContext.Provider
			value={{
				color: "#0E1217",
				size: "1.25em",
			}}
		>
			<Toolbar>
				{/* 
					It might change the state of Slate to relfect that we need bold tags.				
					The editable component will then rerender and show what we have specified based on this jsx tag.
					Bold true is added to the object in editor.children to the paragraphs where we apply that.
					So the editor object stores what parts get that assigned to but the Editable then decides what to show.
					Editable then wrappes that part with a classic jsx tag <blockquote> that I think I can style. 
				*/}
				<div className="flex gap-[14px]">
					<MarkButton format="bold" icon={<AiOutlineBold />} editor={editor} />
					<MarkButton
						format="italic"
						icon={<AiOutlineItalic />}
						editor={editor}
					/>
					<MarkButton
						format="underline"
						icon={<AiOutlineUnderline />}
						editor={editor}
					/>
					<BlockButton
						format="block-quote"
						icon={<RiDoubleQuotesR />}
						editor={editor}
					/>
					<BlockButton
						format="numbered-list"
						icon={<AiOutlineOrderedList />}
						editor={editor}
					/>
					<BlockButton
						format="bulleted-list"
						icon={<AiOutlineUnorderedList />}
						editor={editor}
					/>
				</div>
			</Toolbar>
		</IconContext.Provider>
	);
};

export const EditableInstance = ({
	placeholder = "",
	disabled = false,
	className = "",
	scroll = false,
}) => {
	const editor = useSlate();
	const renderElement = useCallback((props) => <Element {...props} />, []);
	const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

	const handleKeyDown = (event, editor) => {
		const { key } = event;
		const { selection } = editor;

		const checkIfList = (format) => isBlockActive(editor, format);

		for (const hotkey in HOTKEYS) {
			if (isHotkey(hotkey, event)) {
				event.preventDefault();
				const mark = HOTKEYS[hotkey];
				toggleMark(editor, mark);
			}
		}

		if (key === "Backspace") {
			const isAtStart =
				selection.anchor.path[0] === 0 &&
				selection.anchor.path[1] === 0 &&
				selection.focus.path[0] === 0 &&
				selection.focus.path[1] === 0 &&
				selection.anchor.offset === 0 &&
				selection.focus.offset === 0;

			const isList =
				checkIfList("bulleted-list") || checkIfList("numbered-list");

			const isAtListStart =
				isList && selection.anchor.offset === 0 && selection.focus.offset === 0;

			if (isAtStart) {
				resetBlocks([], editor);
				resetMarks(editor);
			} else if (isAtListStart) {
				event.preventDefault();
				resetBlocks([], editor);
			}
		}

		if (key === "Enter") {
			if (!event.shiftKey) {
				event.preventDefault();
				Editor.insertBreak(editor);

				const isList =
					checkIfList("bulleted-list") || checkIfList("numbered-list");

				resetBlocks(isList ? ["numbered-list", "bulleted-list"] : [], editor);
				resetMarks(editor);
			} else {
				event.preventDefault();
				editor.insertText("\n");
			}
		}
	};

	return (
		<Editable
			className={`w-full h-full editor-content ${className} ${
				scroll ? "overflow-y-auto" : ""
			}`}
			renderElement={renderElement}
			renderLeaf={renderLeaf}
			placeholder={placeholder}
			spellCheck
			onKeyDown={(event) => handleKeyDown(event, editor)}
			readOnly={disabled}
		/>
	);
};

// previously: className="h-[400px] flex flex-col gap-[37px] p-content items-start  shadow-md rounded-lg"
// to stretch they just all need h-full (including parent div, not necessarily anything about min-h)

/* 
if (isAstChange) {
					// Save the value to Local Storage.
					// const content = JSON.stringify(value);
					setInputValue(serialize(editor));
					// localStorage.setItem("content", content);
				}


*/
