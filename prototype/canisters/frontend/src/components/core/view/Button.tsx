const Button = ({ propFunction, text }) => {
	const clickHandler = (event) => {
		event.preventDefault();
		propFunction();
	};

	return (
		<button
			className="heading1-20x-stretch flex justify-center items-center px-[25px] py-[10px] bg-colorBackgroundComponents shadow-md rounded-lg"
			onClick={clickHandler}
		>
			{text}
		</button>
	);
};

export default Button;
