import React from "react";

const Title = ({ value, setValue, Error, placeholder, maxLength }) => {
	const handler = (e) => {
		setValue(e.target.value);
	};

	// TODO: somehow this does not stretch if the input does not have a concrete width.
	return (
		<div className="max-w-[600px] w-full py-[8px] px-[15px] flex justify-between items-center relative  shadow-md rounded-md bg-colorBackgroundComponents">
			<input
				className="w-full outline-none placeholder:heading3 heading3"
				type="text"
				value={value}
				onChange={handler}
				onFocus={() => {
					if (value === placeholder) {
						setValue("");
					}
				}}
				onBlur={() => {
					if (value === "") {
						setValue(placeholder);
					}
				}}
			/>

			<div className="w-max heading3 pl-[10px]">
				{value.length}/{maxLength}
			</div>
			{Error.isError ? (
				<div className="w-max text-normal text-colorRed flex justify-center absolute bottom-11 ">
					{Error.message}
				</div>
			) : (
				<></>
			)}
		</div>
	);
};

export default Title;
