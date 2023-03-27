import React from "react";
import { ArrowButton } from "../components/core/Button";

const Profile = ({ logout }) => {
	return (
		<div>
			<div className="text-normal flex justify-start mb-3">Coming Soon</div>
			<div data-cy="divider" className="w-full h-[1px]  bg-colorLines"></div>
			<div className="mt-10 flex justify-start">
				<ArrowButton propFunction={logout} text="Logout" />
			</div>
		</div>
	);
};

export default Profile;
