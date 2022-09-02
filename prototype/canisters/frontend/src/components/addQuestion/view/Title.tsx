const Title = ({ value, setValue, placeholder }) => {
	const handler = (e) => {
		setValue(e.target.value);
	};

	return (
		<div className="flex justify-between w-[900px] gap-[24px] items-center py-[10px] px-[15px] shadow-md rounded-md bg-colorBackgroundComponents">
			<input
				className="outline-none placeholder:heading3-18px heading3-18px p-0 w-full"
				type="text"
				placeholder={placeholder}
				value={value}
				onChange={handler}
			/>

			<div className="heading3-18px">0/300</div>
		</div>
	);
};

export default Title;
