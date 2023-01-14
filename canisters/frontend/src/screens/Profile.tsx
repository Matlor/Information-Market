import React from "react";

import { useState } from "react";
import Button from "../components/core/Button";
import Date from "../components/core/Date";

const Profile = ({ isConnected, user, updateUserInformation }: any) => {
	const [userName, setUserName] = useState<any>(user.userName);
	const [avatar, setAvatar] = useState<any>("");
	const [isError, setIsError] = useState<any>(false);

	const handleImageChange = (event: any) => {
		const file = event.target.files[0];
		setIsError(false);
		if (file.size > 500000) {
			setIsError(true);
			return;
		}
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = async function () {
			setAvatar(reader.result as string);
		};
	};

	const handleNameChange = (event: any) => {
		setUserName(event.target.value);
	};

	const updateProfile = async () => {
		var currentAvatar = user.avatar;
		if (avatar) {
			currentAvatar = avatar;
		}
		updateUserInformation(userName, currentAvatar);
	};

	const [isIconShown, setIsIconShown] = useState(false);

	return (
		<>
			{isConnected ? (
				<div className="flex flex-col gap-[20px]">
					<label
						className="p-6 flex w-60 h-60 rounded-full bg-colorBackgroundComponents shadow-md relative hover:cursor-pointer "
						onMouseEnter={() => {
							setIsIconShown(true);
						}}
						onMouseLeave={() => {
							setIsIconShown(false);
						}}
					>
						<input
							type="file"
							max-size="500000" // 500kb
							style={{ display: "none" }}
							onChange={handleImageChange}
						/>
						<img
							className="rounded-full"
							src={avatar ? avatar : user.avatar}
							alt=""
						/>
						<div
							className={`${
								isIconShown ? "visible" : "hidden"
							}  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
						>
							<svg
								width="40"
								height="40"
								viewBox="0 0 86 72"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M78.037 11.0769H64.5L61.275 2.0967C61.0522 1.48221 60.6439 0.951051 60.1059 0.575778C59.5678 0.200506 58.9263 -0.000576216 58.269 1.24025e-06H27.731C26.3873 1.24025e-06 25.1829 0.84066 24.735 2.0967L21.5 11.0769H7.96296C3.56343 11.0769 0 14.6176 0 18.989V64.0879C0 68.4593 3.56343 72 7.96296 72H78.037C82.4366 72 86 68.4593 86 64.0879V18.989C86 14.6176 82.4366 11.0769 78.037 11.0769ZM78.8333 64.0879C78.8333 64.5231 78.475 64.8791 78.037 64.8791H7.96296C7.525 64.8791 7.16667 64.5231 7.16667 64.0879V18.989C7.16667 18.5538 7.525 18.1978 7.96296 18.1978H26.5465L28.2486 13.4703L30.528 7.12088H55.462L57.7414 13.4703L59.4435 18.1978H78.037C78.475 18.1978 78.8333 18.5538 78.8333 18.989V64.0879ZM43 24.5275C34.2009 24.5275 27.0741 31.6088 27.0741 40.3516C27.0741 49.0945 34.2009 56.1758 43 56.1758C51.7991 56.1758 58.9259 49.0945 58.9259 40.3516C58.9259 31.6088 51.7991 24.5275 43 24.5275ZM43 49.8462C37.7245 49.8462 33.4444 45.5934 33.4444 40.3516C33.4444 35.1099 37.7245 30.8571 43 30.8571C48.2755 30.8571 52.5556 35.1099 52.5556 40.3516C52.5556 45.5934 48.2755 49.8462 43 49.8462Z"
									fill="black"
								/>
							</svg>
						</div>
					</label>

					<div className="flex flex-col gap-[3px] items-center heading3">
						<input
							type="text"
							className="w-30  p-2.5 text-center outline-none placeholder:heading3 rounded-md shadow-md bg-colorBackgroundComponents border-none"
							onChange={handleNameChange}
							value={userName}
							maxLength={30}
						/>
						<div className="text-normal mt-4 flex items-center gap-2">
							<Date date={user.joinedDate} text="text-normal" />
						</div>
					</div>

					<div className="self-center">
						<Button propFunction={updateProfile} text={"Save"} />
						{isError ? (
							<div className="w-max text-normal mt-2 text-colorRed flex justify-center absolute   left-1/2 transform -translate-x-1/2 -translate-y-2/2">
								{"File has to be < 500kb"}
							</div>
						) : (
							<></>
						)}
					</div>
				</div>
			) : (
				<div className="heading3">Not connected</div>
			)}
		</>
	);
};

export default Profile;
