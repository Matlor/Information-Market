const StagesBar = ({ status }) => {
	const createBars = () => {
		const statusToNumber = (status) => {
			switch (status) {
				case "OPEN":
					return 0;
				case "PICKANSWER":
					return 1;
				case "DISPUTABLE":
					return 2;
				case "ARBITRATION":
					return 3;
				case "CLOSED":
					return 4;
				default:
					return 5;
			}
		};

		var backgroundColor = "bg-colorIcon";
		for (let i = 0; i < 5; i++) {
			var x = statusToNumber(status);
			if (x == i) {
				backgroundColor = "bg-colorBackgroundComponents";
			}

			return (
				<div
					className={`${backgroundColor} w-[11px] h-[3px] border-[0.2px] border-colorIcon rounded-[7px]`}
				></div>
			);
		}
	};

	return (
		<div className="flex justify-between items-center gap-[4px] w-max">
			{createBars()}
		</div>
	);
};

export default StagesBar;
