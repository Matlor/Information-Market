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

	return (
		<div className="flex relative justify-between w-[900px] gap-[24px] items-center py-[10px] px-[15px] shadow-md rounded-md bg-colorBackgroundComponents">
			<input
				className="outline-none placeholder:heading3-18px heading3-18px p-0 w-full"
				type="text"
				value={value}
				maxLength={maxValue}
				onChange={handler}
			/>

			<div className="heading3-18px">
				{value.length}/{maxValue}
			</div>
			{isError ? (
				<div className="text-14px text-colorRed  flex justify-center w-max absolute bottom-12 ">
					The value has to be between {minValue} and {maxValue}
				</div>
			) : (
				<></>
			)}
		</div>
	);
};

export default Title;
