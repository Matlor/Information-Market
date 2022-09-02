import { serialize } from "../services/SlateHelpers";
import React, { useCallback, useMemo, useState } from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, useSlate, Slate } from "slate-react";
import { Button, Icon, Toolbar } from "../services/SlateHelpers";
import {
	Text,
	Editor,
	Transforms,
	createEditor,
	Element as SlateElement,
} from "slate";
import { withHistory } from "slate-history";
import { IconContext } from "react-icons";
import {
	AiOutlineBold,
	AiOutlineItalic,
	AiOutlineUnderline,
	AiOutlineOrderedList,
	AiOutlineUnorderedList,
} from "react-icons/ai";
import { RiDoubleQuotesR } from "react-icons/ri";

// KEY SHORTCUTS
const HOTKEYS = {
	"mod+b": "bold",
	"mod+i": "italic",
	"mod+u": "underline",
	"mod+Enter": "softbreak",
};
const LIST_TYPES = ["numbered-list", "bulleted-list"];

const SlateEditor = ({ inputValue, setInputValue }) => {
	const placeholder = "Ask your question here";

	const isSomeBlockActive = () => {
		const blocks = ["block-quote", "numbered-list", "bulleted-list"];

		var someIsActive = false;
		for (let i = 0; i < blocks.length; i++) {
			var format = blocks[i];
			if (isBlockActive(editor, format)) {
				console.log(format, "active format");
				someIsActive = true;
			}
		}

		return someIsActive;
	};

	const resetBlocks = (excluding) => {
		const blocks = ["block-quote", "numbered-list", "bulleted-list"];

		if (excluding) {
			for (let i = 0; i < excluding.length; i++) {
				for (let j = 0; j < blocks.length; j++) {
					if (excluding[i] === blocks[j]) {
						blocks.splice(j, 1);
					}
				}
			}
		}

		for (let i = 0; i < blocks.length; i++) {
			var format = blocks[i];
			if (isBlockActive(editor, format)) {
				toggleBlock(editor, format);
			}
		}
	};

	const toggleBlock = (editor, format) => {
		console.log(format);
		const isActive = isBlockActive(editor, format);
		console.log(isActive);
		// if block is not active, toggle all others.
		// only one block can be active.
		if (!isActive) {
			resetBlocks([format]);
		}

		const isList = LIST_TYPES.includes(format);

		Transforms.unwrapNodes(editor, {
			match: (n) =>
				!Editor.isEditor(n) &&
				SlateElement.isElement(n) &&
				LIST_TYPES.includes(n.type),
			split: true,
		});

		let newProperties;

		newProperties = {
			type: isActive ? "paragraph" : isList ? "list-item" : format,
		};

		console.log(newProperties, "newProperties");
		Transforms.setNodes(editor, newProperties);
		console.log(editor, "editor");

		if (!isActive && isList) {
			const block = { type: format, children: [] };
			Transforms.wrapNodes(editor, block);
		}
	};

	const isBlockActive = (editor, format, blockType = "type") => {
		const { selection } = editor;
		if (!selection) return false;

		const [match] = Array.from(
			Editor.nodes(editor, {
				at: Editor.unhangRange(editor, selection),
				match: (n) =>
					!Editor.isEditor(n) &&
					SlateElement.isElement(n) &&
					n[blockType] === format,
			})
		);

		return !!match;
	};

	const BlockButton = ({ format, icon }) => {
		const editor = useSlate();
		return (
			<Button
				active={isBlockActive(editor, format)}
				onMouseDown={(event) => {
					event.preventDefault();
					toggleBlock(editor, format);
				}}
			>
				<Icon>{icon}</Icon>
			</Button>
		);
	};
	// ---------------------------------------------- Marks  ----------------------------------------------

	const isSomeMarkActive = () => {
		const marks = ["bold", "italic", "underline"];

		var someIsActive = false;
		for (let i = 0; i < marks.length; i++) {
			var format = marks[i];
			if (isMarkActive(editor, format)) {
				someIsActive = true;
			}
		}

		return someIsActive;
	};

	const resetMarks = () => {
		const marks = ["bold", "italic", "underline"];

		for (let i = 0; i < marks.length; i++) {
			var format = marks[i];

			if (isMarkActive(editor, format)) {
				toggleMark(editor, format);
			}
		}
	};

	const isMarkActive = (editor, format) => {
		const marks = Editor.marks(editor);
		return marks ? marks[format] === true : false;
	};

	const toggleMark = (editor, format) => {
		const isActive = isMarkActive(editor, format);

		if (isActive) {
			Editor.removeMark(editor, format);
		} else {
			Editor.addMark(editor, format, true);
		}
	};

	const MarkButton = ({ format, icon }) => {
		const editor = useSlate();
		return (
			<Button
				active={isMarkActive(editor, format)}
				onMouseDown={(event) => {
					event.preventDefault();
					toggleMark(editor, format);
				}}
			>
				<Icon>{icon}</Icon>
			</Button>
		);
	};

	// ---------------------------------------------- Element  ----------------------------------------------

	const Element = ({ attributes, children, element }) => {
		console.log(attributes, "attributes");
		console.log(children, "children");
		console.log(element, "element");

		const style = { textAlign: element.align };
		switch (element.type) {
			case "block-quote":
				return (
					<blockquote style={style} {...attributes}>
						{children}
					</blockquote>
				);
			case "bulleted-list":
				return (
					<ul style={style} {...attributes}>
						{children}
					</ul>
				);

			case "list-item":
				return (
					<li style={style} {...attributes}>
						{children}
					</li>
				);
			case "numbered-list":
				return (
					<ol style={style} {...attributes}>
						{children}
					</ol>
				);

			default:
				return (
					<p style={style} {...attributes}>
						{children}
					</p>
				);
		}
	};

	const renderElement = useCallback((props) => <Element {...props} />, []);

	// -------------------------------------------- useMemo & History --------------------------------------------
	const editor = useMemo(() => withHistory(withReact(createEditor())), []);

	const Leaf = ({ attributes, children, leaf }) => {
		if (leaf.bold) {
			children = <strong>{children}</strong>;
		}

		if (leaf.italic) {
			children = <em>{children}</em>;
		}

		if (leaf.underline) {
			children = <u>{children}</u>;
		}

		return <span {...attributes}>{children}</span>;
	};

	// 	return <span {...attributes}>{children}</span>;
	const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

	const initialValue = [
		{
			type: "paragraph",
			children: [{ text: "" }],
		},
	];

	return (
		<div className="flex flex-col gap-[37px] items-start bg-colorBackgroundComponents self-stretch h-[319px] shadow-md rounded-md w-full p-[45px] editor-wrapper">
			<IconContext.Provider
				value={{
					color: "gray",
					className: "global-class-name",
					size: "1.5em",
				}}
			>
				<Slate
					editor={editor}
					value={initialValue}
					onChange={(value) => {
						const isAstChange = editor.operations.some(
							(op) => "set_selection" !== op.type
						);
						if (isAstChange) {
							console.log("hit");
							// Save the value to Local Storage.
							//const content = JSON.stringify(value);
							setInputValue(serialize(editor));
							//localStorage.setItem("content", content);
						}
					}}
				>
					<Toolbar>
						<div className="flex justify-between w-72">
							{/* MARKS */}
							<MarkButton format="bold" icon={<AiOutlineBold />} />
							<MarkButton format="italic" icon={<AiOutlineItalic />} />
							<MarkButton format="underline" icon={<AiOutlineUnderline />} />

							{/* BLOCKS */}
							<BlockButton format="block-quote" icon={<RiDoubleQuotesR />} />
							<BlockButton
								format="numbered-list"
								icon={<AiOutlineOrderedList />}
							/>
							<BlockButton
								format="bulleted-list"
								icon={<AiOutlineUnorderedList />}
							/>
						</div>
					</Toolbar>

					<Editable
						className="overflow-y-scroll overflow-x-hidden self-stretch h-full"
						renderElement={renderElement}
						renderLeaf={renderLeaf}
						placeholder={placeholder}
						spellCheck
						onKeyDown={(event) => {
							for (const hotkey in HOTKEYS) {
								if (isHotkey(hotkey, event)) {
									event.preventDefault();
									const mark = HOTKEYS[hotkey];
									toggleMark(editor, mark);
								}
							}

							const checkIfList = (format) => {
								var res = isBlockActive(editor, format);
								return res;
							};

							const toggleIfEmptyList = (format) => {
								const leaf = Editor.leaf(editor, editor.selection);

								if (leaf[0].text === "") {
									event.preventDefault();
									toggleBlock(editor, format);
								}
							};

							if (event.key === "Backspace") {
								// IF ON FIRST LINE OF DOCUMENT, RESET THE STYLING COMPLETELY.
								var { selection } = editor;
								if (
									selection.anchor.path[0] === 0 &&
									selection.anchor.path[1] === 0 &&
									selection.focus.path[0] === 0 &&
									selection.focus.path[1] === 0 &&
									selection.anchor.offset === 0 &&
									selection.focus.offset === 0
								) {
									resetBlocks([]);
									resetMarks();
								}

								// IF CURSER AT BEGINNING OF LI AND BACKSPACE, RESET BLOCKS
								const bullFormat = "bulleted-list";
								const numFormat = "numbered-list";

								var isList = false;
								if (checkIfList(bullFormat) || checkIfList(numFormat)) {
									isList = true;
								}

								selection = editor.selection;
								if (
									isList &&
									selection.anchor.offset === 0 &&
									selection.focus.offset === 0
								) {
									event.preventDefault();
									resetBlocks([]);
								}
							}

							// NEW LINE ON ENTER, RESET SYTLING, UNLESS LIST
							if (event.key === "Enter" && !event.shiftKey) {
								event.preventDefault();

								Editor.insertBreak(editor);

								const bullFormat = "bulleted-list";
								const numFormat = "numbered-list";
								if (checkIfList(bullFormat) || checkIfList(numFormat)) {
									resetBlocks(["numbered-list", "bulleted-list"]);
								} else {
									resetBlocks([]);
								}

								resetMarks();
							}

							if (event.key === "Enter" && event.shiftKey) {
								event.preventDefault();
								editor.insertText("\n");
							}
						}}
					/>
				</Slate>
			</IconContext.Provider>
		</div>
	);
};

export default SlateEditor;
