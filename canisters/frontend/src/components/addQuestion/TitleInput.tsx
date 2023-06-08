import React from "react";

const TitleInput = ({
	value,
	setValue,
	placeholder,
	maxLength,
	disabled,
	className = "",
}) => {
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
			className={`w-full overflow-hidden outline-none resize-none placeholder:h1 placeholder:opacity-20 h1 bg-transparent  ${className}`}
			onInput={onInput}
			value={value}
			placeholder={placeholder}
			maxLength={maxLength}
			disabled={disabled}
		/>
	);
};

export default TitleInput;
