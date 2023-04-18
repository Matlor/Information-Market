import React from "react";
import Button from "../components/core/Button";
import { ShapeGrid } from "../components/core/TestPicture";

const Profile = ({ logout, principal }) => {
	return (
		<div>
			<div className="flex justify-between mb-5 text-large">
				<div>Your Principal: </div>
				<div className="italic">{principal.toString()}</div>
				<ShapeGrid uniqueString={principal} />
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
