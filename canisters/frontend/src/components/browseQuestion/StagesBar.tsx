import React from "react";
import { moStatusToString } from "../core/utils/conversions";
import { FQuestion } from "../../screens/Question";

interface IStagesBar {
	status: FQuestion["status"];
}

const StagesBar = ({ status }: IStagesBar) => {
	const createBars = () => {
		const statusToNumber = (status) => {
			switch (moStatusToString(status)) {
				case "OPEN":
					return 1;
				case "PICKANSWER":
					return 2;
				case "DISPUTABLE":
					return 3;
				case "ARBITRATION":
					return 4;
				case "CLOSED":
					return 5;
				default:
					return 0;
			}
		};

		var backgroundColor = "bg-colorBackground";
		var arr: any = [];
		for (let i = 0; i < 5; i++) {
			var x = statusToNumber(status);
			if (x == i) {
				backgroundColor = "bg-colorBackgroundComponents";
			}

			arr.push(
				<div
					key={i}
					className={`${backgroundColor} small-ball-dimension border-[2.5px] border-colorBackground rounded-full`}
				></div>
			);
		}
		return arr;
	};

	return (
		<div className={`flex justify-between items-center gap-[6px] w-max`}>
			{createBars().map((item) => {
				return item;
			})}
		</div>
	);
};

export default StagesBar;
