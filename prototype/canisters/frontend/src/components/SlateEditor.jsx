import { useCallback, useMemo } from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, useSlate, Slate } from "slate-react";

import { Button, Icon, Toolbar } from "./SlateHelpers";
import {
	Editor,
	Transforms,
	createEditor,
	Element as SlateElement,
} from "slate";

import { withHistory } from "slate-history";

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
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

const SlateEditor = () => {
	// ---------------------------------------------- Block == Elements ----------------------------------------------

	const toggleBlock = (editor, format) => {
		const isActive = isBlockActive(
			editor,
			format,
			TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
		);

		const isList = LIST_TYPES.includes(format);

		Transforms.unwrapNodes(editor, {
			match: (n) =>
				!Editor.isEditor(n) &&
				SlateElement.isElement(n) &&
				LIST_TYPES.includes(n.type) &&
				!TEXT_ALIGN_TYPES.includes(format),
			split: true,
		});

		let newProperties;
		if (TEXT_ALIGN_TYPES.includes(format)) {
			newProperties = {
				align: isActive ? undefined : format,
			};
		} else {
			newProperties = {
				type: isActive ? "paragraph" : isList ? "list-item" : format,
			};
		}
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

	// Ah this is a general button to trigger the block stuff
	// We pass the format to it (heading-two) and somehow the icon
	// Ah of course this renders something, and among others, the icon.
	// depending on what we give it.
	const BlockButton = ({ format, icon }) => {
		const editor = useSlate();
		return (
			<Button
				active={isBlockActive(
					editor,
					format,
					TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
				)}
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
			case "heading-three":
				return (
					<h3 style={style} {...attributes}>
						{children}
					</h3>
				);
			case "heading-two":
				return (
					<h2 style={style} {...attributes}>
						{children}
					</h2>
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

	// ---------------------------------------------- Leaf  ----------------------------------------------

	const Leaf = ({ attributes, children, leaf }) => {
		if (leaf.bold) {
			children = <strong>{children}</strong>;
		}

		if (leaf.code) {
			children = <code>{children}</code>;
		}

		if (leaf.italic) {
			children = <em>{children}</em>;
		}

		if (leaf.underline) {
			children = <u>{children}</u>;
		}

		return <span {...attributes}>{children}</span>;
	};

	const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

	// -------------------------------------------- useMemo & History --------------------------------------------
	// return a memoized value.
	// createEditor is the create function and there is list of dependencies.
	// useMemo will only recompute the memoized value when one of the dependencies has changed.
	// History hold previous operations so that they can be undone
	// WithReact: Adds React and DOM specific behaviors to the editor.
	// Ok so that just creates the editor basically.
	const editor = useMemo(() => withHistory(withReact(createEditor())), []);

	const initialValue = [
		{
			type: "paragraph",
			children: [{ text: "" }],
		},
	];

	return (
		<div className=" w-full mb-96 ">
			<div className="border bg-red-100 p-20 m-20">
				<Slate editor={editor} value={initialValue}>
					<Toolbar>
						<div className="flex flex-col mb-10">
							{/* MARKS */}
							<MarkButton format="bold" icon="format_bold" />
							<MarkButton format="italic" icon="format_italic" />
							<MarkButton format="underline" icon="format_underlined" />
							<MarkButton format="code" icon="code" />

							{/* BLOCKS */}
							<BlockButton format="heading-two" icon="looks_two" />
							<BlockButton format="heading-three" icon="looks_three" />
							<BlockButton format="block-quote" icon="format_quote" />
							<BlockButton format="numbered-list" icon="format_list_numbered" />
							<BlockButton format="bulleted-list" icon="format_list_bulleted" />
							<div> -</div>
							<BlockButton format="left" icon="format_align_left" />
							<BlockButton format="center" icon="format_align_center" />
							<BlockButton format="right" icon="format_align_right" />
							<BlockButton format="justify" icon="format_align_justify" />
						</div>
					</Toolbar>

					<div className="border editor-wrapper">
						<Editable
							style={{ border: "solid 1px", height: "400px", padding: "20px" }}
							renderElement={renderElement}
							renderLeaf={renderLeaf}
							placeholder="Enter some rich text…"
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

								console.log(event, "event");

								const resetEverything = (includingList) => {
									// INSERT NEW DEFAULT
									//editor.insertNode({});
									Editor.insertBreak(editor);

									// MARKS
									const marks = ["bold", "italic", "underline", "code"];

									for (let i = 0; i < marks.length; i++) {
										var format = marks[i];

										if (isMarkActive(editor, format)) {
											console.log("hit inner");
											toggleMark(editor, format);
										}
									}
									// BLOCKS
									const blocks = [
										"heading-two",
										"heading-three",
										"block-quote",
									];
									if (includingList) {
										blocks.push("numbered-list");
										blocks.push("bulleted-list");
									}

									for (let i = 0; i < blocks.length; i++) {
										var format = blocks[i];
										if (isBlockActive(editor, format)) {
											toggleBlock(editor, format);
										}
									}
								};

								const checkIfList = (format) => {
									var res = isBlockActive(
										editor,
										format,
										TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
									);
									return res;
								};

								const toggleIfEmptyList = (format) => {
									const leaf = Editor.leaf(editor, editor.selection);
									if (leaf[0].text === "") {
										event.preventDefault();
										toggleBlock(editor, format);
									}
								};

								/* TOGGLE LIST IF EMPTY AND BACKSPACE */
								if (event.key === "Backspace") {
									// CHECK IF WITHIN LIST
									const bullFormat = "bulleted-list";
									if (checkIfList(bullFormat)) {
										toggleIfEmptyList(bullFormat);
									}

									const numFormat = "numbered-list";
									if (checkIfList(numFormat)) {
										toggleIfEmptyList(numFormat);
									}
								}

								/* NEW LINE ON ENTER, RESET SYTLING, UNLESS LIST */
								if (event.key === "Enter" && !event.shiftKey) {
									event.preventDefault();

									const bullFormat = "bulleted-list";
									if (checkIfList(bullFormat)) {
										resetEverything(false);
										return;
									}

									const numFormat = "numbered-list";
									if (checkIfList(numFormat)) {
										resetEverything(false);
										return;
									}

									resetEverything(true);

									/* // IF EITHER HBULLET OR NUMBERED DO THIS
									if (resNum || resBul) {
										console.log("should ot");
										const leaf = Editor.leaf(editor, editor.selection);

										if (leaf[0].text === "") {
											event.preventDefault();
											toggleBlock(editor, format);
										} else {
											resetEverything();
											if (resNum) {
												toggleBlock(editor, "numbered-list");
											}
											if (resBul) {
												toggleBlock(editor, "bulleted-list");
											}
										}

										// ELSE DO SOMETHING COMPLETELY UNRELATED
									} else {
										resetEverything();
									} */
								}

								// unrelated to above
								if (event.key === "Enter" || event.key === "Backspace") {
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
		</div>
	);
};

export default SlateEditor;

//const test = Array.from(Editor.nodes(editor, { at: [] }));
//console.log(Editor.leaf(editor, editor.selection), "my thing");
//console.log(editor.selection, "selec");

/* 
		console.log(
			Editor.nodes(editor, {
				at: Editor.unhangRange(editor, selection),
				match: (n) =>
					!Editor.isEditor(n) &&
					SlateElement.isElement(n) &&
					n[blockType] === format,
			})
		); */
