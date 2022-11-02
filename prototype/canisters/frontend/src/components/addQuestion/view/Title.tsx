const Title = ({
	value,
	setValue,
	isError,
	minValue = 0,
	maxValue = 300,
	placeholder,
}) => {
	const handler = (e) => {
		setValue(e.target.value);
	};

	// somehow this does not stretch if the input does not have a concrete width.
	return (
		<div className="max-w-[600px] w-full py-[8px] px-[15px] flex justify-between items-center relative  shadow-md rounded-md bg-colorBackgroundComponents">
			<input
				className="w-full outline-none placeholder:heading3 heading3"
				type="text"
				value={value}
				maxLength={maxValue}
				onChange={handler}
				onFocus={() => {
					if (value === placeholder) {
						setValue("");
					}
				}}
				onBlur={() => {
					if (value === "") {
						setValue(placeholder);
					}
				}}
			/>

			<div className="w-max heading3 pl-[10px]">
				{value.length}/{maxValue}
			</div>
			{isError ? (
				<div className="w-max text-normal text-colorRed flex justify-center absolute bottom-11 ">
					Between {minValue} and {maxValue}
				</div>
			) : (
				<></>
			)}
		</div>
	);
};

export default Title;
