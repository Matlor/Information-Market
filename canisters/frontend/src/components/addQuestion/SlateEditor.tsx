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

const initialValue = [
	{
		type: "paragraph",
		children: [{ text: "" }],
	},
];

export const SlateEditor = ({
	inputValue,
	setInputValue,
	children,
	className = "",
}) => {
	// could I put this outside of this component?
	const editor = useMemo(() => withHistory(withReact(createEditor())), []);

	const resetEditor = () => {
		console.log("hit resetEditor");
		Editor.withoutNormalizing(editor, () => {
			editor.children = initialValue;
			const point = { path: [0, 0], offset: 0 };
			editor.selection = { anchor: point, focus: point };
			editor.history = { redos: [], undos: [] };
		});
	};

	// maybe need to add "|| editor.children.length === 0"
	if (inputValue === "" && editor.children !== initialValue) {
		resetEditor();
	}
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
			<div className={` ${className}`}>{children}</div>
		</Slate>
	);
};

export const TollbarInstance = ({ className = "", color = "#8B8B8B" }) => {
	const editor = useSlate();
	return (
		<IconContext.Provider
			value={{
				color: color,
				size: "1.1em",
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
				<div className={`flex ${className} `}>
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
			className={`w-full editor-content ${className} `}
			renderElement={renderElement}
			renderLeaf={renderLeaf}
			placeholder={placeholder}
			renderPlaceholder={({ children, attributes }) => (
				<div className="!opacity-20" {...attributes}>
					{children}
				</div>
			)}
			spellCheck
			onKeyDown={(event) => handleKeyDown(event, editor)}
			readOnly={disabled}
		/>
	);
};
