import React from "react";
import ReactDOM from "react-dom";
import escapeHtml from "escape-html";

import { jsx } from "slate-hyperscript";
import { Text, Element as SlateElement, Editor, Transforms } from "slate";
import { useSlate } from "slate-react";
// ------------------------------------

// ---------------------------------------------- Marks  ----------------------------------------------

// ---------------------------------------------- Element  ----------------------------------------------

// KEY SHORTCUTS
export const HOTKEYS = {
	"mod+b": "bold",
	"mod+i": "italic",
	"mod+u": "underline",
	"mod+Enter": "softbreak",
};
export const LIST_TYPES = ["numbered-list", "bulleted-list"];

export const resetBlocks = (excluding, editor) => {
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

export const toggleBlock = (editor, format) => {
	const isActive = isBlockActive(editor, format);
	// if block is not active, toggle all others.
	// only one block can be active.
	if (!isActive) {
		resetBlocks([format], editor);
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

export const isBlockActive = (editor, format, blockType = "type") => {
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

export const BlockButton = ({ format, icon, editor }) => {
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

export const isSomeMarkActive = () => {
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

export const resetMarks = (editor) => {
	const marks = ["bold", "italic", "underline"];

	for (let i = 0; i < marks.length; i++) {
		var format = marks[i];

		if (isMarkActive(editor, format)) {
			toggleMark(editor, format);
		}
	}
};

export const isMarkActive = (editor, format) => {
	const marks = Editor.marks(editor);
	return marks ? marks[format] === true : false;
};

export const toggleMark = (editor, format) => {
	const isActive = isMarkActive(editor, format);

	if (isActive) {
		Editor.removeMark(editor, format);
	} else {
		Editor.addMark(editor, format, true);
	}
};

export const MarkButton = ({ editor, format, icon }) => {
	//const editor = useSlate();
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

export const Element = ({ attributes, children, element }) => {
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

export const Leaf = ({ attributes, children, leaf }) => {
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

// ------------------------------------

export const Button = React.forwardRef(
	({ className, active, reversed, ...props }, ref) => (
		<span {...props} ref={ref} className="" />
	)
);

export const EditorValue = React.forwardRef(
	({ className, value, ...props }, ref) => {
		const textLines = value.document.nodes
			.map((node) => node.text)
			.toArray()
			.join("\n");
		return (
			<div ref={ref} {...props} className="">
				<div className="">Slate's value as text</div>
				<div className="">{textLines}</div>
			</div>
		);
	}
);

export const Icon = React.forwardRef(({ className, ...props }, ref) => (
	<span {...props} ref={ref} className="" />
));

export const Instruction = React.forwardRef(({ className, ...props }, ref) => (
	<div {...props} ref={ref} className="" />
));

export const Menu = React.forwardRef(({ className, ...props }, ref) => (
	<div {...props} ref={ref} className="" />
));

export const Portal = ({ children }) => {
	return typeof document === "object"
		? ReactDOM.createPortal(children, document.body)
		: null;
};

export const Toolbar = React.forwardRef(({ className, ...props }, ref) => (
	<Menu {...props} ref={ref} className="" />
));

export const serialize = (node) => {
	if (Text.isText(node)) {
		let string = escapeHtml(node.text);
		if (node.bold) {
			string = `<strong>${string}</strong>`;
		}
		if (node.italic) {
			string = `<em>${string}</em>`;
		}
		if (node.underline) {
			string = `<u>${string}</u>`;
		}

		return string;
	}

	const children = node.children.map((n) => serialize(n)).join("");

	switch (node.type) {
		case "block-quote":
			return `<blockquote><p>${children}</p></blockquote>`;

		case "bulleted-list":
			return `<ul>${children}</ul>`;

		case "heading-three":
			return `<h3>${children}</h3>`;

		case "heading-two":
			return `<h2>${children}</h2>`;

		case "list-item":
			return `<li>${children}</li>`;

		case "numbered-list":
			return `<ol>${children}</ol>`;

		case "paragraph":
			return `<p>${children}</p>`;

		case "link":
			return `<a href="${escapeHtml(node.url)}">${children}</a>`;

		default:
			return children;
	}
};

// Not used right now. Will be required for editing text.
export const deserialize = (el, markAttributes = {}) => {
	if (el.nodeType === Node.TEXT_NODE) {
		return jsx("text", markAttributes, el.textContent);
	} else if (el.nodeType !== Node.ELEMENT_NODE) {
		return null;
	}

	const nodeAttributes = { ...markAttributes };

	switch (el.nodeName) {
		case "STRONG":
			nodeAttributes.bold = true;
			break;

		case "EM":
			nodeAttributes.italic = true;
			break;

		case "U":
			nodeAttributes.underline = true;
			break;
		default:
			break;
	}

	const children = Array.from(el.childNodes)
		.map((node) => deserialize(node, nodeAttributes))
		.flat();

	if (children.length === 0) {
		children.push(jsx("text", nodeAttributes, ""));
	}

	switch (el.nodeName) {
		case "BODY":
			return jsx("fragment", {}, children);
		case "BR":
			return "\n";
		case "BLOCKQUOTE":
			return jsx("element", { type: "block-quote" }, children);
		case "P":
			return jsx("element", { type: "paragraph" }, children);
		case "A":
			return jsx(
				"element",
				{ type: "link", url: el.getAttribute("href") },
				children
			);
		case "UL":
			return jsx("element", { type: "bulleted-list" }, children);

		case "H3":
			return jsx("element", { type: "heading-three" }, children);

		case "H2":
			return jsx("element", { type: "heading-two" }, children);

		case "LI":
			return jsx("element", { type: "list-item" }, children);

		case "OL":
			return jsx("element", { type: "numbered-list" }, children);

		default:
			return children;
	}
};

/* const isSomeBlockActive = () => {
		const blocks = ["block-quote", "numbered-list", "bulleted-list"];

		var someIsActive = false;
		for (let i = 0; i < blocks.length; i++) {
			var format = blocks[i];
			if (isBlockActive(editor, format)) {
				someIsActive = true;
			}
		}

		return someIsActive;
	}; */
