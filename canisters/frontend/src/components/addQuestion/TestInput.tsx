import React, { useState } from "react";

function NumberInput({ value, setValue }) {
	console.log(value, "value");
	console.log(JSON.stringify(value), "value");

	const handleInputChange = (e) => {
		let newValue = e.target.value;

		// Remove leading zero if the user types a non-zero digit
		if (newValue.length === 1 && newValue[0] !== "0") {
			setValue(Number(newValue));
		} else {
			setValue(Number(newValue));
		}
	};

	const handleFocus = (e) => {
		if (value === 0) {
			console.log("hit");
			setValue(undefined);
		}
	};

	const handleBlur = (e) => {
		if (value === "" || value === undefined) {
			setValue(0);
		}
	};

	return (
		<input
			type="number"
			value={JSON.stringify(value) === "undefined" ? "" : value}
			onChange={handleInputChange}
			onFocus={handleFocus}
			onBlur={handleBlur}
			placeholder=""
		/>
	);
}

export default NumberInput;
