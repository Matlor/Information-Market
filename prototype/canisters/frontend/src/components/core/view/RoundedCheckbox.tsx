const RoundedCheckox = ({ isChecked }) => {
	var border = "border-2";
	var test = "";
	if (isChecked) {
		test = "bg-colorIcon";
		var border = "border-2";
	} else {
		test = "";
		var border = "border";
	}

	return (
		<div
			className={` ${border} border-2 border-colorIcon rounded-full w-[16px] h-[16px] relative `}
		>
			<div
				className={`w-[8px] h-[8px] ${test} rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 `}
			></div>
		</div>
	);
};

export default RoundedCheckox;
