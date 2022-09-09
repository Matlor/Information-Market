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
		<>
			<div className="flex relative justify-between gap-[24px] items-center self-stretch py-[10px] px-[15px] shadow-md rounded-md bg-colorBackgroundComponents">
				<input
					className="outline-none placeholder:heading3-18px heading3-18px p-0"
					type="number"
					onChange={handler}
					value={isEmpty ? "" : value}
				/>

				<div className="border-colorLines self-stretch border-l-[1px] w-0"></div>
				<div className="heading3-18px">{unit} </div>

				{isError ? (
					<div className="text-14px text-colorRed  flex justify-center w-max absolute bottom-12 ">
						The value has to be between {minValue} and {maxValue}
					</div>
				) : (
					<></>
				)}
			</div>
		</>
	);
};

export default Input;
