import React from "react";

const TitleInput = ({ value, setValue, placeholder, maxLength }) => {
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
			className="w-full mt-3 outline-none resize-none overflow-hidden placeholder:opacity-50"
			onInput={onInput}
			value={value}
			placeholder={placeholder}
			maxLength={maxLength}
		/>
	);
};

export default TitleInput;
