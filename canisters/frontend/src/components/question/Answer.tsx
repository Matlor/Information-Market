import React from "react";
import { Profile } from "../core/Profile";
import { SettingsIcon } from "../core/Icons";
import parse from "html-react-parser";

// TODO: pass principal to profile
const Answer = ({ author_id, content, tag, action, timeStamp }) => {
	return (
		<div data-cy="answer" className="flex flex-col gap-4">
			<div className="flex justify-between w-full">
				<Profile principal={author_id} name={"Domwoe"} minutes={timeStamp} />
				<div className="flex gap-4">
					{tag}
					<SettingsIcon />
				</div>
			</div>
			{/* editor-wrapper */}
			<div className="">{parse(content)}</div>
			<div className="flex justify-end">{action} </div>
		</div>
	);
};

export default Answer;
