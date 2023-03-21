import React, { useState, useContext } from "react";
import RoundedCheckbox from "../core/RoundedCheckbox";
import Loading from "../core/Loading";
import { IStatusMap, MyInteractions } from "../../screens/BrowseQuestion";
import { IconArrowUpDown } from "../core/Icons";
import { ActorContext } from "../api/Context";

type Checks = {
	status: IStatusMap;
	setStatus: (field: any) => void;
	myInteractions: MyInteractions;
	toggleMyInteractions: (field: any) => void;
};

interface IFilter {
	checks: Checks;
	isLoading: boolean;
}

const Filter = ({ checks, isLoading }: IFilter) => {
	// ---------- Context ----------
	const { user } = useContext(ActorContext);

	const [display, setDisplay] = useState<"hidden" | "visible">("hidden");

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

	return (
		<div className="max-w-[220px] w-full  relative text-normal border-2">
			<button
				onClick={(e) => {
					rotateIconHandler();
					e.stopPropagation();
				}}
				className="w-full flex justify-between items-center py-[8px] px-[15px]"
			>
				<div>
					{isLoading ? (
						<div className="absolute right-[100%] mr-4">
							<Loading />
						</div>
					) : (
						<></>
					)}
					Filter
				</div>
				<IconArrowUpDown
					isFull
					isRotated={display === "visible" ? true : false}
				/>
			</button>
			<div
				className={`${display} absolute w-full flex flex-col gap-[13px] mt-[5px] py-[10px] text-12px rounded-md shadow-lg  bg-colorBackgroundComponents `}
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				{/* TODO: Could be a component iterating through keys of status obj */}
				<div
					className="w-full z-10 flex items-center gap-[18px] px-[15px]"
					onClick={() => checks.setStatus("open")}
				>
					<RoundedCheckbox isChecked={checks.status.open} />
					Open
				</div>
				<div
					className="w-full z-10 flex items-center gap-[18px] px-[15px]"
					onClick={() => {
						checks.setStatus("pickanswer");
					}}
				>
					<RoundedCheckbox isChecked={checks.status.pickanswer} />
					Winner Selection
				</div>
				<div
					className="w-full z-10 flex  items-center gap-[18px] px-[15px]"
					onClick={() => checks.setStatus("disputable")}
				>
					<RoundedCheckbox isChecked={checks.status.disputable} />
					Open for Dispute
				</div>
				<div
					className="w-full z-10 flex  items-center gap-[18px] px-[15px]"
					onClick={() => checks.setStatus("arbitration")}
				>
					<RoundedCheckbox isChecked={checks.status.arbitration} />
					Arbitration
				</div>
				<div
					className="w-full z-10 flex  items-center gap-[18px] px-[15px]"
					onClick={() => checks.setStatus("closed")}
				>
					<RoundedCheckbox isChecked={checks.status.closed} />
					Closed
				</div>

				<div
					className={`${
						user.principal !== undefined ? "visible" : "hidden"
					} h-[1px] bg-colorBackground`}
				></div>

				{user.principal ? (
					<div
						className="w-full z-10 flex items-center gap-[18px] px-[15px]"
						onClick={() => {
							checks.toggleMyInteractions(user.principal);
						}}
					>
						<RoundedCheckbox isChecked={checks.myInteractions ? true : false} />
						My Interactions
					</div>
				) : (
					<></>
				)}
			</div>
		</div>
	);
};

export default Filter;
