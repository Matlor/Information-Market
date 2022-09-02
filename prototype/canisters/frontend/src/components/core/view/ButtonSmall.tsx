const ButtonSmall = ({ propFunction, text }) => {
	const clickHandler = (event) => {
		event.preventDefault();
		propFunction();
	};

	return (
		<button
			className="heading3-18px flex justify-center items-center px-[25px] py-[10px] bg-colorBackgroundComponents shadow-md rounded-lg"
			onClick={clickHandler}
		>
			{text}
		</button>
	);
};

export default ButtonSmall;
