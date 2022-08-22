const ListWrapper = ({ children }) => {
	return (
		<div className="flex flex-col justify-center gap-[17px] p-0">
			{children}
		</div>
	);
};

export default ListWrapper;
