const FieldWrapper = ({ children }) => {
	return (
		<div className="w-full p-10 border-t-2 border-b-2  min-h-44 flex justify-center  items-center">
			{children}
		</div>
	);
};

export default FieldWrapper;
