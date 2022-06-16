// prism
import Prism from "prismjs";

// TODO: check if necessary
import "prismjs/components/prism-python";
import "prismjs/components/prism-php";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-java";

import { serialize } from "./SlateHelpers";

import React, { useCallback, useMemo, useState } from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, useSlate, Slate } from "slate-react";

import { Button, Icon, Toolbar } from "./SlateHelpers";
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
	AiOutlineFontSize,
} from "react-icons/ai";

import { BsCodeSlash, BsTypeH2, BsTypeH3 } from "react-icons/bs";
import { RiDoubleQuotesR } from "react-icons/ri";
// ---------------------------------------------- Added functionalities ----------------------------------------------

// KEY SHORTCUTS
const HOTKEYS = {
	"mod+b": "bold",
	"mod+i": "italic",
	"mod+u": "underline",
	"mod+`": "code",
	"mod+Enter": "softbreak",
};
const LIST_TYPES = ["numbered-list", "bulleted-list"];

const SlateEditor = ({ inputValue, setInputValue }) => {
	// make default something that the editor could deal with
	const [serializedValue, setSerializedValue] = useState("");

	// ---------------------------------------------- Block == Elements ----------------------------------------------

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
		// BLOCKS
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

		format = "code";
		if (isMarkActive(editor, format)) {
			toggleMark(editor, format);
		}
	};

	const toggleBlock = (editor, format) => {
		const isActive = isBlockActive(editor, format);

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

		Transforms.setNodes(editor, newProperties);

		if (!isActive && isList) {
			const block = { type: format, children: [] };
			Transforms.wrapNodes(editor, block);
		}
	};

	// checks if that thing is active.
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
	// ---------------------------------------------- Mark == Text  ----------------------------------------------

	const isSomeMarkActive = () => {
		const marks = ["bold", "italic", "underline", "code"];

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
		// MARKS
		const marks = ["bold", "italic", "underline", "code"];

		for (let i = 0; i < marks.length; i++) {
			var format = marks[i];

			if (isMarkActive(editor, format)) {
				toggleMark(editor, format);
			}
		}
	};

	// is used inside of event handler called toggleMark
	// just checks whate the current mark is
	// probably current mark is where the cursor is
	const isMarkActive = (editor, format) => {
		const marks = Editor.marks(editor);
		return marks ? marks[format] === true : false;
	};

	// is event handler of MarkButton
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
	// return a memoized value.
	// createEditor is the create function and there is list of dependencies.
	// useMemo will only recompute the memoized value when one of the dependencies has changed.
	// History hold previous operations so that they can be undone
	// WithReact: Adds React and DOM specific behaviors to the editor.
	// Ok so that just creates the editor basically.
	const editor = useMemo(() => withHistory(withReact(createEditor())), []);

	// ---------------------------------------------- Leaf (& Prism Leaf)  ----------------------------------------------
	const cssFunc = (leaf) => {
		if (leaf.comment) {
			return "text-red-400";
		} else if (leaf.operator || leaf.url) {
			return "text-yellow-800";
		} else if (leaf.keyword) {
			return "text-orange-400";
		} else if (leaf.variable) {
			return "text-orange-400";
		} else if (leaf.variable || leaf.regex) {
			return "text-orange-400";
		} else if (
			leaf.number ||
			leaf.boolean ||
			leaf.tag ||
			leaf.constant ||
			leaf.symbol ||
			leaf["attr-name"] ||
			leaf.selector
		) {
			return "text-pink-700";
		} else if (leaf.punctuation) {
			return "text-gray-300";
		} else if (leaf.string || leaf.char) {
			return "text-green-700";
		} else if (leaf.function || leaf["class-name"]) {
			return "text-red-400";
		}
	};

	// background: hsla(0, 0%, 100%, 0.5);
	const Leaf = ({ attributes, children, leaf }) => {
		if (leaf.bold) {
			children = <strong>{children}</strong>;
		}

		if (leaf.code) {
			children = (
				<code
					{...attributes}
					className={`bg-gray-100 font-mono
						${cssFunc(leaf)}
					`}
				>
					{children}
				</code>
			);
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

	// ---------------------------- PRISM --------------------------------------------

	// Use state when adding more languages
	// const [language, setLanguage] = useState("js");
	const language = "js";

	// decorate function depends on the language selected
	const decorate = useCallback(
		([node, path]) => {
			const ranges = [];
			if (!Text.isText(node)) {
				return ranges;
			}
			const tokens = Prism.tokenize(node.text, Prism.languages[language]);
			let start = 0;

			for (const token of tokens) {
				const length = getLength(token);
				const end = start + length;

				if (typeof token !== "string") {
					ranges.push({
						[token.type]: true,
						anchor: { path, offset: start },
						focus: { path, offset: end },
					});
				}

				start = end;
			}

			return ranges;
		},
		[language]
	);

	// used inside decorate function
	const getLength = (token) => {
		if (typeof token === "string") {
			return token.length;
		} else if (typeof token.content === "string") {
			return token.content.length;
		} else {
			return token.content.reduce((l, t) => l + getLength(t), 0);
		}
	};

	// modifications and additions to prism library
	Prism.languages.javascript = Prism.languages.extend("javascript", {});
	Prism.languages.insertBefore("javascript", "prolog", {
		comment: { pattern: /\/\/[^\n]*/, alias: "comment" },
	});

	const initialValue = [
		{
			type: "paragraph",
			children: [{ text: "" }],
		},
	];

	return (
		<div className=" ">
			<IconContext.Provider
				value={{ color: "gray", className: "global-class-name", size: "1.5em" }}
			>
				<div className=" bg-primary p-10 mb-10 ">
					<Slate
						editor={editor}
						value={initialValue}
						onChange={(value) => {
							const isAstChange = editor.operations.some(
								(op) => "set_selection" !== op.type
							);
							if (isAstChange) {
								// Save the value to Local Storage.

								//const content = JSON.stringify(value);
								setInputValue(serialize(editor));
								//localStorage.setItem("content", content);
							}
						}}
					>
						<Toolbar>
							<div className="flex justify-between w-72 mb-4  p-2">
								{/* MARKS */}
								<MarkButton format="bold" icon={<AiOutlineBold />} />
								<MarkButton format="italic" icon={<AiOutlineItalic />} />
								<MarkButton format="underline" icon={<AiOutlineUnderline />} />
								<MarkButton format="code" icon={<BsCodeSlash />} />

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

						<div className=" editor-wrapper">
							<Editable
								decorate={decorate}
								className="border h-96 p-4"
								renderElement={renderElement}
								renderLeaf={renderLeaf}
								placeholder="Ask your Question here..."
								spellCheck
								autoFocus
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
											resetBlocks();
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
											resetBlocks();
										}
									}

									// TAB
									if (event.key === "Tab") {
										event.preventDefault();
										Transforms.insertText(editor, "\t");
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
											resetBlocks();
										}

										resetMarks();
									}

									if (event.key === "Enter" && event.shiftKey) {
										event.preventDefault();
										editor.insertText("\n");
									}
								}}
							/>
						</div>
					</Slate>
				</div>
			</IconContext.Provider>
		</div>
	);
};

export default SlateEditor;
