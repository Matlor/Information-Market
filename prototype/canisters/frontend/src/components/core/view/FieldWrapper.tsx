const FieldWrapper = ({ children, effect = false }) => {
	return (
		<div
			className={`flex gap-[25px] py-[8px] px-[35px] justify-center items-center ${
				effect ? "shadow-effect" : "shadow-md"
			} rounded-md bg-colorBackgroundComponents`}
		>
			{children}
		</div>
	);
};

export default FieldWrapper;
