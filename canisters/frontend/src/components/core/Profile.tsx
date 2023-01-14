import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { Principal } from "@dfinity/principal";
import { fromNullable } from "@dfinity/utils";
import { blobToBase64Str } from "../core/utils/conversions";
import { ActorContext } from "../../components/api/Context";

// --------------------  Types --------------------
// TODO: make default profile first letter of name
interface IProfile {
	id: Principal;
	name: string;
}

const Profile = ({ id, name }: IProfile) => {
	// TODO: not really necessary
	/* async function createDefaultAvatar() {
		return new Promise(async (resolve) => {
			let motoko_image = await fetch(motokoPath);
			var reader = new FileReader();
			reader.readAsDataURL(await motoko_image.blob());
			reader.onload = () => {
				resolve(reader.result);
			};
		});
	} */

	// --------------------  Context --------------------
	const { user } = useContext(ActorContext);

	const [avatar, setAvatar] = useState<string | undefined>(undefined);
	useEffect(() => {
		const fetchAvatar = async () => {
			const avatar = fromNullable(await user.market.get_profile(id));
			if (avatar) {
				setAvatar(blobToBase64Str(avatar));
			}
		};
		fetchAvatar();
		// TODO: is this necessary?
	}, [user.market.get_profile]);

	return (
		<>
			{name ? (
				<div className="flex items-center p-0 gap-2.5 w-max">
					{avatar ? (
						<img
							className="rounded-full w-[27px] h-[27px]"
							src={avatar}
							alt=""
						/>
					) : (
						<div className="w-[27px] h-[27px] rounded-full border-[1px] border-colorBackground"></div>
					)}

					<div className="text-small w-[60px] text-ellipsis overflow-hidden whitespace-nowrap">
						{name}
					</div>
				</div>
			) : (
				<div></div>
			)}
		</>
	);
};

export default Profile;
