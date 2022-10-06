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
		<div className="relative ">
			<FieldWrapper>
				<input
					className="w-full outline-none placeholder:heading3 heading3 p-0 "
					type="number"
					onChange={handler}
					value={isEmpty ? "" : value}
				/>

				<div className="border-colorLines self-stretch border-l-[1px] w-0"></div>
				<div className="heading3">{unit} </div>

				{isError ? (
					<div className="text text-colorRed  flex justify-center w-max absolute bottom-12 ">
						The value has to be between {minValue} and {maxValue}
					</div>
				) : (
					<></>
				)}
			</FieldWrapper>
		</div>
	);
};

export default Input;
