import React from "react";
import ReactDOM from "react-dom";

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
