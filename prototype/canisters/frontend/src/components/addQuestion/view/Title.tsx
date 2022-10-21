import FieldWrapper from "../../core/view/FieldWrapper";

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
		<FieldWrapper>
			<div className="w-[33vw] flex justify-between items-center relative">
				<input
					className="outline-none placeholder:heading3 heading3 p-0 w-full"
					type="text"
					value={value}
					maxLength={maxValue}
					onChange={handler}
				/>

				<div className="heading3">
					{value.length}/{maxValue}
				</div>
				{isError ? (
					<div className="text-normal text-colorRed  flex justify-center w-max absolute bottom-9 ">
						Between {minValue} and {maxValue}
					</div>
				) : (
					<></>
				)}
			</div>
		</FieldWrapper>
	);
};

export default Title;
