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

const Input = ({ setValue, Validity, unit }: IInput) => {
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
		<div className="w-max text-normal-number flex gap-1 py-[8px] px-[15px] items-center relative">
			<input
				className="w-12 outline-none placeholder:text-normal-number  p-0 items-center"
				type="number"
				onChange={handler}
				placeholder={"0"}
			/>
			<div>{unit}</div>

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
