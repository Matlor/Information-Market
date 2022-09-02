const Input = ({ value, setValue, placeholder, unit, type }) => {
	const handler = (e) => {
		if (type === "number") {
			setValue(Number(e.target.value));
		} else {
			setValue(e.target.value);
		}
	};

	return (
		<div className="flex justify-between gap-[24px] items-center self-stretch py-[10px] px-[15px] shadow-md rounded-md bg-colorBackgroundComponents">
			<input
				className="outline-none placeholder:heading3-18px heading3-18px p-0"
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={handler}
			/>
			<div className="border-colorLines self-stretch border-l-[1px] w-0"></div>
			<div className="heading3-18px">{unit} </div>
		</div>
	);
};

export default Input;
