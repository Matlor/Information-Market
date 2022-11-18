const Loading = ({ color = "colorLines", style = "loading" }) => {
	const basicStyle = "w-[26px] h-[26px] rounded-full";
	const borderWidth = "border-[4px]";

	if (style === "filled") {
		const applyStyle = () => {
			if (color === "colorLines") {
				return "bg-colorLines";
			} else if (color === "colorBackgroundComponents") {
				return "bg-colorBackgroundComponents";
			}
		};

		return (
			<div>
				<div className={`${basicStyle} ${applyStyle()} shadow-md`}></div>
			</div>
		);
	}

	if (style === "empty") {
		const applyStyle = () => {
			if (color === "colorLines") {
				return "border-colorLines";
			} else if (color === "colorBackgroundComponents") {
				return "border-colorBackgroundComponents";
			}
		};
		return (
			<div>
				<div
					className={`${basicStyle} ${borderWidth} ${applyStyle()} shadow-md`}
				></div>
			</div>
		);
	}

	if (style === "loading") {
		const applyStyle = () => {
			if (color === "colorLines") {
				return "border-l-[transparent] border-colorLines";
			} else if (color === "colorBackgroundComponents") {
				return "border-l-[transparent] border-colorBackgroundComponents";
			}
		};

		return (
			<div>
				<div
					className={`${basicStyle} rounded-full animate-spin ${borderWidth} ${applyStyle()} `}
				></div>
			</div>
		);
	}

	return <div></div>;
};

export default Loading;
