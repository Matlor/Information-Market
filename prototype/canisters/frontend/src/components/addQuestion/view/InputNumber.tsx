import { useState } from "react";
import FieldWrapper from "../../core/view/FieldWrapper";

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
		<FieldWrapper>
			<div className="flex gap-[25px] items-center relative">
				<input
					className="w-full outline-none placeholder:heading3 heading3 p-0 "
					type="number"
					onChange={handler}
					value={isEmpty ? "" : value}
				/>

				<div className="border-colorBackground rounded-full self-stretch border-l-[3px] w-0"></div>
				<div className="heading3">{unit} </div>

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

export default Input;
