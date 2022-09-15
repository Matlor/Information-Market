import { useState } from "react";
import RoundedCheckox from "../..//core/view/RoundedCheckbox";

// TO DO: Simplify and style checkbox/dropdown

const Filter = ({
	statusMap,
	setStatusMap,
	myInteractions,
	setMyInteractions,
	isConnected,
}) => {
	window.addEventListener("click", () => {
		if (display === "visible") {
			setDisplay("hidden");
		}
	});

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

	const [display, setDisplay] = useState<any>("hidden");

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

	const checkbox = (num, checkBoxState, setCheckBoxState) => {
		const clickHandler = (num, checkBoxState, setCheckBoxState) => {
			const newCheckBoxState = [...checkBoxState];
			newCheckBoxState[num] = !newCheckBoxState[num];
			setCheckBoxState(newCheckBoxState);

			// Modify status map
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

		return (
			<>
				<div onClick={() => clickHandler(num, checkBoxState, setCheckBoxState)}>
					<RoundedCheckox isChecked={checkBoxState[num]} />
				</div>
			</>
		);
	};

	const myInteractionsHandler = () => {
		setMyInteractions(!myInteractions);
	};

	return (
		<div className="w-[200px] relative shadow-md rounded-md bg-colorBackgroundComponents heading3-18px">
			<div className="flex justify-between items-center py-[10px] px-[15px] ">
				Filter
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
				className={`${display} absolute w-full mt-[5px] py-[10px] shadow-lg  flex flex-col gap-[13px] rounded-md bg-colorBackgroundComponents text-12px`}
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				<div className=" w-max z-10 flex items-center gap-[18px] px-[15px]">
					{checkbox(0, checkBoxState, setCheckBoxState)}
					Open
				</div>
				<div className="w-max z-10 flex items-center gap-[18px] px-[15px]">
					{checkbox(1, checkBoxState, setCheckBoxState)}
					Winner Selection
				</div>
				<div className="w-max z-10 flex  items-center gap-[18px] px-[15px]">
					{checkbox(2, checkBoxState, setCheckBoxState)}
					Open for Dispute
				</div>
				<div className="w-max z-10 flex  items-center gap-[18px] px-[15px]">
					{checkbox(3, checkBoxState, setCheckBoxState)}
					Arbitration
				</div>
				<div className="w-max z-10 flex  items-center gap-[18px] px-[15px]">
					{checkbox(4, checkBoxState, setCheckBoxState)}
					Closed
				</div>
				<div className="h-[1px] bg-colorLines"></div>

				<div
					className={`${
						isConnected ? "visible" : "hidden"
					} w-max z-10 flex items-center gap-[18px] px-[15px]`}
					onClick={myInteractionsHandler}
				>
					<RoundedCheckox isChecked={myInteractions} />
					My Interactions
				</div>
			</div>
		</div>
	);
};

export default Filter;
