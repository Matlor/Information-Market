import React from "react";
import Button from "../components/core/Button";

const Profile = ({ logout }) => {
	return (
		<div>
			<div className="flex justify-start mb-5 text-large">Coming Soon</div>
			<div data-cy="divider" className="w-full h-[3px] bg-gray-100"></div>
			<div className="mt-5">
				<Button
					onClick={logout}
					text="Logout"
					size="lg"
					arrow={false}
					color={"black"}
				/>
			</div>
		</div>
	);
};

export default Profile;
