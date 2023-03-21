import React from "react";

const Title = ({ value, setValue, Validity, placeholder, maxLength }) => {
	const handler = (e) => {
		setValue(e.target.value);
	};

	// TODO: somehow this does not stretch if the input does not have a concrete width.
	return (
		<div className="max-w-[600px] w-full py-[8px] px-[15px] flex justify-between items-center relative  shadow-md rounded-md bg-colorBackgroundComponents">
			<input
				className="w-full outline-none placeholder:text-normal text-normal"
				type="text"
				onChange={handler}
				placeholder={placeholder}
			/>

			<div className="w-max text-normal pl-[10px]">
				<div className="flex w-max">
					{value ? value.length : 0} / {maxLength}
				</div>
			</div>
			{!Validity.isValid && value ? (
				<div className="w-max text-normal text-colorRed flex justify-center absolute bottom-11 ">
					{Validity.invalidMessage}
				</div>
			) : (
				<></>
			)}
		</div>
	);
};

export default Title;
