import React from "react";
import { useState } from "react";

interface IInput {
	setValue: (value: number) => void;
	Validity: {
		isValid: boolean;
		invalidMessage: string;
	};
	unit: string;
}

const Input = ({ setValue, Validity, unit, value }) => {
	const [isEmpty, setIsEmpty] = useState<boolean>(true);

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
		<div className="w-max text-small flex gap-1 py-[8px] px-[15px]  rounded-sm items-center relative">
			<input
				className="w-10 outline-none placeholder:text-small p-0 "
				type="number"
				onChange={handler}
				value={value}
				placeholder={"0"}
				min={1}
			/>
			<div className="">{unit}</div>

			{!Validity.isValid && !isEmpty ? (
				<div className="text-normal-small text-colorRed  flex justify-center w-max absolute bottom-11 ">
					{Validity.invalidMessage}
				</div>
			) : (
				<></>
			)}
		</div>
	);
};

export default Input;
