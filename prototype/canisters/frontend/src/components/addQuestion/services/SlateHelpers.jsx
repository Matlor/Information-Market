import React from "react";
import ReactDOM from "react-dom";
import escapeHtml from "escape-html";
import { jsx } from "slate-hyperscript";
import { Text, Element as SlateElement } from "slate";

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
