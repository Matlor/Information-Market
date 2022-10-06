import { useState } from "react";

const Sort = ({
	setOrderIsAscending,
	setOrderField,
	orderIsAscending,
}: any) => {
	const [display, setDisplay] = useState<any>("hidden");

	window.addEventListener("click", () => {
		if (display === "visible") {
			setDisplay("hidden");
		}
	});

	const rotateIconHandler = () => {
		if (display === "hidden") {
			setDisplay("visible");
		} else {
			setDisplay("hidden");
		}
	};

	const rotateIcon = () => {
		if (display === "visible") {
			return "rotate-180";
		} else {
			return ")";
		}
	};

	const ascTimeHandler = () => {
		setOrderField("status_end_date");
		setOrderIsAscending(true);
	};

	const desTimeHandler = () => {
		setOrderField("status_end_date");
		setOrderIsAscending(false);
	};

	const ascRewardHandler = () => {
		setOrderField("reward");
		setOrderIsAscending(true);
	};
	const desRewardHandler = () => {
		setOrderField("reward");
		setOrderIsAscending(false);
	};

	return (
		<div className="w-[200px] relative shadow-md rounded-md bg-colorBackgroundComponents heading3">
			<div className="flex justify-between items-center gap-[79px] py-[8px] px-[15px] ">
				Sort
				<button
					onClick={(e) => {
						rotateIconHandler();
						e.stopPropagation();
					}}
				>
					<div className={rotateIcon()}>
						<svg
							width="14"
							height="9"
							viewBox="0 0 14 9"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M0.101701 0.742969L6.63212 8.82646C6.81904 9.05785 7.17897 9.05785 7.36788 8.82646L13.8983 0.742969C14.1409 0.441536 13.9222 0 13.5304 0H0.469584C0.0778387 0 -0.140902 0.441536 0.101701 0.742969Z"
								fill="#969696"
							/>
						</svg>
					</div>
				</button>
			</div>

			<div
				className={`${display} absolute mt-[5px] py-[10px] shadow-lg  flex flex-col gap-[13px] rounded-md bg-colorBackgroundComponents text-12px`}
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				<div className="w-[163px] z-10 flex items-center gap-[18px] px-[15px] justify-between">
					Time Left
					<div className="flex flex-col gap-[2px] self-baseline">
						<button onClick={ascTimeHandler}>
							<div className="rotate-180 ">
								<svg
									width="14"
									height="9"
									viewBox="0 0 14 9"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M0.101701 0.742969L6.63212 8.82646C6.81904 9.05785 7.17897 9.05785 7.36788 8.82646L13.8983 0.742969C14.1409 0.441536 13.9222 0 13.5304 0H0.469584C0.0778387 0 -0.140902 0.441536 0.101701 0.742969Z"
										fill="#969696"
									/>
								</svg>
							</div>
						</button>
						<button onClick={desTimeHandler}>
							<svg
								width="14"
								height="9"
								viewBox="0 0 14 9"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M0.101701 0.742969L6.63212 8.82646C6.81904 9.05785 7.17897 9.05785 7.36788 8.82646L13.8983 0.742969C14.1409 0.441536 13.9222 0 13.5304 0H0.469584C0.0778387 0 -0.140902 0.441536 0.101701 0.742969Z"
									fill="#969696"
								/>
							</svg>
						</button>
					</div>
				</div>
				<div className="w-[163px] z-10 flex items-center gap-[18px] px-[15px] justify-between">
					Reward
					<div className="flex flex-col gap-[2px] self-baseline">
						<button onClick={ascRewardHandler}>
							<div className="rotate-180">
								<svg
									width="14"
									height="9"
									viewBox="0 0 14 9"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M0.101701 0.742969L6.63212 8.82646C6.81904 9.05785 7.17897 9.05785 7.36788 8.82646L13.8983 0.742969C14.1409 0.441536 13.9222 0 13.5304 0H0.469584C0.0778387 0 -0.140902 0.441536 0.101701 0.742969Z"
										fill="#969696"
									/>
								</svg>
							</div>
						</button>
						<button onClick={desRewardHandler}>
							<svg
								width="14"
								height="9"
								viewBox="0 0 14 9"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M0.101701 0.742969L6.63212 8.82646C6.81904 9.05785 7.17897 9.05785 7.36788 8.82646L13.8983 0.742969C14.1409 0.441536 13.9222 0 13.5304 0H0.469584C0.0778387 0 -0.140902 0.441536 0.101701 0.742969Z"
									fill="#969696"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Sort;
