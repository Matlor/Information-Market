import React from "react";

const TitleInput = ({ value, setValue, Validity, placeholder, maxLength }) => {
	const onInput = (e) => {
		e.target.style.height = "auto";
		e.target.style.height = `${e.target.scrollHeight}px`;

		if (setValue) {
			setValue(e.target.value);
		}
	};

	return (
		<div className="relative">
			<div className="w-max text-extrasmall-number text-colorTextGrey">
				<div className="flex w-max">
					{value ? value.length : 0} / {maxLength}
				</div>
			</div>

			{!Validity.isValid && value ? (
				<div className="w-max text-normal-small text-colorRed flex justify-center absolute -top-10 ">
					{Validity.invalidMessage}
				</div>
			) : (
				<></>
			)}

			<textarea
				rows={1}
				className="w-full mt-3 outline-none resize-none overflow-hidden title placeholder:title placeholder:opacity-50"
				onInput={onInput}
				value={value}
				placeholder={placeholder}
			/>
		</div>
	);
};

export default TitleInput;
