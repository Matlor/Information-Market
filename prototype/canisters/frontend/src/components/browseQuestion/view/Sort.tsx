import React from "react";

import { useState } from "react";

const Sort = ({
	setOrderIsAscending,
	setOrderField,
	orderIsAscending,
}: any) => {
	const [display, setDisplay] = useState<any>("hidden");
	const [selected, setSelected] = useState<any>({
		timeLeftUp: false,
		timeLeftDown: false,
		rewardUp: false,
		rewardDown: true,
	});

	const changeSelected = (currentKey) => {
		let newSelectedState = {
			timeLeftUp: false,
			timeLeftDown: false,
			rewardUp: false,
			rewardDown: false,
		};
		newSelectedState[currentKey] = true;
		setSelected(newSelectedState);
	};

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
		changeSelected("timeLeftUp");
		setOrderField("status_end_date");
		setOrderIsAscending(true);
	};

	const desTimeHandler = () => {
		changeSelected("timeLeftDown");
		setOrderField("status_end_date");
		setOrderIsAscending(false);
	};

	const ascRewardHandler = () => {
		changeSelected("rewardUp");
		setOrderField("reward");
		setOrderIsAscending(true);
	};
	const desRewardHandler = () => {
		changeSelected("rewardDown");
		setOrderField("reward");
		setOrderIsAscending(false);
	};

	return (
		<div className="max-w-[220px] w-full relative shadow-md rounded-md bg-colorBackgroundComponents heading3">
			<button
				onClick={(e) => {
					rotateIconHandler();
					e.stopPropagation();
				}}
				className="w-full flex justify-between items-center py-[8px] px-[15px]"
			>
				<div>Sort</div>

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
			<div
				className={`${display} absolute w-full mt-[5px] py-[10px] shadow-lg  flex flex-col justify-center gap-[13px] rounded-md bg-colorBackgroundComponents text-12px`}
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				<div
					className="z-10 flex items-center gap-[18px] px-[15px] justify-between"
					onClick={selected.rewardDown ? ascRewardHandler : desRewardHandler}
				>
					Reward
					<div className="flex flex-col gap-[2px] self-baseline">
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
									fill={selected.rewardUp ? "#969696" : "#EBF2ED"}
								/>
							</svg>
						</div>

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
									fill={selected.rewardDown ? "#969696" : "#EBF2ED"}
								/>
							</svg>
						</button>
					</div>
				</div>
				<div
					className="z-10 flex justify-between items-center gap-[18px] px-[15px] "
					onClick={selected.timeLeftDown ? ascTimeHandler : desTimeHandler}
				>
					Time Left
					<div className="flex flex-col gap-[2px] self-stretch">
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
										fill={selected.timeLeftUp ? "#969696" : "#EBF2ED"}
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
									fill={selected.timeLeftDown ? "#969696" : "#EBF2ED"}
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
