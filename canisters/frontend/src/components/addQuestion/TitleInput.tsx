import React from "react";

const TitleInput = ({ value, setValue, placeholder, maxLength, disabled }) => {
	const onInput = (e) => {
		e.target.style.height = "auto";
		e.target.style.height = `${e.target.scrollHeight}px`;
		if (setValue) {
			setValue(e.target.value);
		}
	};

	return (
		<textarea
			rows={1}
			className="w-full mt-3 overflow-hidden outline-none resize-none placeholder:opacity-50 h1 disabled:bg-transparent"
			onInput={onInput}
			value={value}
			placeholder={placeholder}
			maxLength={maxLength}
			disabled={disabled}
		/>
	);
};

export default TitleInput;
