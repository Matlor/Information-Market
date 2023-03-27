import React from "react";
import { Profile } from "../core/Profile";
import Dots from "./Settings";
import parse from "html-react-parser";

// TODO: pass principal to profile
const Answer = ({ author_id, content, tag, action, timeStamp }) => {
	return (
		<div data-cy="answer" className="flex flex-col gap-4">
			<div className="flex gap-2 w-full justify-between">
				<Profile principal={author_id} name={"Domwoe"} minutes={timeStamp} />
				{tag}
				<Dots />
			</div>
			<div className="editor-wrapper text-normal">{parse(content)}</div>
			{action}
		</div>
	);
};

export default Answer;
