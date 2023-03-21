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
		<div className="max-w-[260px] flex gap-[25px] py-[8px] px-[15px] justify-between items-center relative shadow-md rounded-md bg-colorBackgroundComponents">
			<input
				className="w-full outline-none placeholder:text-normal text-normal p-0 "
				type="number"
				onChange={handler}
				placeholder={"0"}
			/>

			<div className="flex gap-6">
				<div className="border-colorBackground rounded-full self-stretch border-l-[2px] w-0"></div>
				<div className="text-normal">{unit} </div>
			</div>
			{!Validity.isValid && !isEmpty ? (
				<div className="text-normal text-colorRed  flex justify-center w-max absolute bottom-11 ">
					{Validity.invalidMessage}
				</div>
			) : (
				<></>
			)}
		</div>
	);
};

export default Input;
