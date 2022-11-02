import { useState } from "react";

const Input = ({ value, setValue, isError, minValue, maxValue, unit }) => {
	const [isEmpty, setIsEmpty] = useState<boolean>(false);

	const handler = (e) => {
		if (e.target.value === "") {
			setValue(Number(e.target.value));
			setIsEmpty(true);
		} else {
			setIsEmpty(false);
			setValue(Number(e.target.value));
		}
	};

	return (
		<div className="max-w-[260px] flex gap-[25px] py-[8px] px-[15px] justify-between items-center relative shadow-md rounded-md bg-colorBackgroundComponents">
			<input
				className="w-full outline-none placeholder:heading3 heading3 p-0 "
				type="number"
				onChange={handler}
				value={isEmpty ? "" : value}
			/>

			<div className="flex gap-6">
				<div className="border-colorBackground rounded-full self-stretch border-l-[2px] w-0"></div>
				<div className="heading3">{unit} </div>
			</div>
			{isError ? (
				<div className="text-normal text-colorRed  flex justify-center w-max absolute bottom-11 ">
					Between {minValue} and {maxValue}
				</div>
			) : (
				<></>
			)}
		</div>
	);
};

export default Input;
