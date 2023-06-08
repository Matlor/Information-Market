import React from "react";
import Button from "../components/core/Button";
import { ShapeGrid } from "../components/core/TestPicture";

const Profile = ({ logout, principal }) => {
	return (
		<div>
			<div className="flex justify-between gap-3 mt-10 text-large">
				<div className="whitespace-nowrap ">Your Principal: </div>
				<div className="w-full italic">{principal.toString()}</div>
			</div>

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
