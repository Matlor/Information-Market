import React from "react";
import { Profile } from "../core/Profile";
import { SettingsIcon } from "../core/Icons";
import parse from "html-react-parser";

// TODO: pass principal to profile
const Answer = ({ author_id, content, tag, action, timeStamp }) => {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<Profile principal={author_id} minutes={timeStamp} />
				<div className="flex items-center gap-4">
					{tag}
					{/* <SettingsIcon fillColor="black" borderColor="black" size={20} /> */}
				</div>
			</div>
			<div className="editor-content">{parse(content)}</div>
			{action && <div className="flex justify-end">{action}</div>}
		</div>
	);
};

export default Answer;
