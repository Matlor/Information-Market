const Pagination = () => {
	return (
		<div className="flex gap-[33px] justify-between items-center px-[66px] py-[31px] bg-colorBackgroundComponents w-min shadow-md rounded-md">
			<svg
				width="12"
				height="18"
				viewBox="0 0 12 18"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M9.98772 16.4453L2 9.78883M9.82836 1.55472L2.47609 8.90699"
					stroke="#969696"
					strokeWidth="2.67884"
					strokeLinecap="round"
				/>
			</svg>

			<div className="heading3-18px">Next</div>
			<div className="heading3-18px">1</div>
			<div className="heading3-18px">2</div>
			<div className="heading3-18px">3</div>
			<div className="heading3-18px">4</div>
			<div className="heading3-18px">5</div>
			<div className="heading3-18px">Prev</div>

			<svg
				width="12"
				height="18"
				viewBox="0 0 12 18"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M2.20001 1.55472L10.1877 8.21115M1.98779 16.4453L9.34006 9.093"
					stroke="#969696"
					strokeWidth="2.67884"
					strokeLinecap="round"
				/>
			</svg>
		</div>
	);
};

export default Pagination;
