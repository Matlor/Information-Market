import { useState } from "react";
import RoundedCheckbox from "../../core/view/RoundedCheckbox";
import Loading from "../../core/view/Loading";
const Filter = ({
	statusMap,
	setStatusMap,
	myInteractions,
	setMyInteractions,
	isConnected,
	filterLoading,
}) => {
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
			return "";
		}
	};

	const options = [
		{ value: "OPEN", label: "Open" },
		{ value: "PICKANSWER", label: "Winner Selection" },
		{ value: "DISPUTABLE", label: "Open for disputes" },
		{ value: "DISPUTED", label: "Arbitration" },
		{ value: "CLOSED", label: "Closed" },
	];

	const checkIfStatusIsSelected = (specificStatus) => {
		for (let i = 0; i < statusMap.length; i++) {
			if (statusMap[i].value === specificStatus.value) {
				return true;
			}
		}
		return false;
	};

	const [checkBoxState, setCheckBoxState] = useState<any>([
		checkIfStatusIsSelected(options[0]),
		checkIfStatusIsSelected(options[1]),
		checkIfStatusIsSelected(options[2]),
		checkIfStatusIsSelected(options[3]),
		checkIfStatusIsSelected(options[4]),
	]);

	const checkBoxClickHandler = (num) => {
		const newCheckBoxState = [...checkBoxState];
		newCheckBoxState[num] = !newCheckBoxState[num];
		setCheckBoxState(newCheckBoxState);

		const newStatusMap = [...statusMap];
		if (newCheckBoxState[num] === true) {
			newStatusMap.push(options[num]);
			setStatusMap(newStatusMap);
		} else {
			const val = options[num];
			for (let i = 0; i < newStatusMap.length; i++) {
				if (newStatusMap[i].value === val.value) {
					newStatusMap.splice(i, 1);
				}
			}
			setStatusMap(newStatusMap);
		}
	};

	const checkbox = (num) => {
		return (
			<div className="">
				<RoundedCheckbox isChecked={checkBoxState[num]} />
			</div>
		);
	};

	const myInteractionsHandler = () => {
		setMyInteractions(!myInteractions);
	};

	return (
		<div className="max-w-[220px] w-full  relative heading3 shadow-md rounded-md bg-colorBackgroundComponents ">
			<button
				onClick={(e) => {
					rotateIconHandler();
					e.stopPropagation();
				}}
				className="w-full flex justify-between items-center py-[8px] px-[15px]"
			>
				<div>
					{filterLoading ? (
						<div className="absolute right-[100%] mr-4">
							<Loading />
						</div>
					) : (
						<></>
					)}
					Filter
				</div>

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
				className={`${display} absolute w-full flex flex-col gap-[13px] mt-[5px] py-[10px] text-12px rounded-md shadow-lg  bg-colorBackgroundComponents `}
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				<div
					className="w-full z-10 flex items-center gap-[18px] px-[15px]"
					onClick={() => checkBoxClickHandler(0)}
				>
					{checkbox(0)}
					Open
				</div>
				<div
					className="w-full z-10 flex items-center gap-[18px] px-[15px]"
					onClick={() => checkBoxClickHandler(1)}
				>
					{checkbox(1)}
					Winner Selection
				</div>
				<div
					className="w-full z-10 flex  items-center gap-[18px] px-[15px]"
					onClick={() => checkBoxClickHandler(2)}
				>
					{checkbox(2)}
					Open for Dispute
				</div>
				<div
					className="w-full z-10 flex  items-center gap-[18px] px-[15px]"
					onClick={() => checkBoxClickHandler(3)}
				>
					{checkbox(3)}
					Arbitration
				</div>
				<div
					className="w-full z-10 flex  items-center gap-[18px] px-[15px]"
					onClick={() => checkBoxClickHandler(4)}
				>
					{checkbox(4)}
					Closed
				</div>

				<div
					className={`${
						isConnected ? "visible" : "hidden"
					} h-[1px] bg-colorBackground`}
				></div>

				<div
					className={`${
						isConnected ? "visible" : "hidden"
					} w-full z-10 flex items-center gap-[18px] px-[15px]`}
					onClick={myInteractionsHandler}
				>
					<RoundedCheckbox isChecked={myInteractions} />
					My Interactions
				</div>
			</div>
		</div>
	);
};

export default Filter;
