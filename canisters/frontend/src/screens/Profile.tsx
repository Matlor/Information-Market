import React from "react";
import Button from "../components/core/Button";

const Profile = ({ logout }) => {
	return (
		<div>
			<div className="flex justify-start gap-2 mb-3 text-normal">
				Coming Soon
			</div>
			<div data-cy="divider" className="w-full h-[1px] "></div>
			<div className="flex justify-start mt-10">
				<Button onClick={logout}>hello</Button>
			</div>
		</div>
	);
};

export default Profile;
