import React from "react";
import parse from "html-react-parser";

interface IContent {
	content: string;
}

const Content = ({ content }: IContent) => {
	return <div className="editor-wrapper text-justify">{parse(content)}</div>;
};

export default Content;
