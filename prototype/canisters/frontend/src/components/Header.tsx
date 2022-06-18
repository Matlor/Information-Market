import { Link, useLocation } from "react-router-dom";

const Header = ({ plug, login, logout }: any) => {
	let { pathname } = useLocation();

	return (
		<div className="h-[110px] font-medium flex items-center  md:justify-end">
			<ul className="w-full  flex justify-around  items-center  md:w-1/2">
				<li className={` ${pathname === "/" ? "underline" : ""} `}>
					{" "}
					<Link to="/">Browse Questions </Link>
				</li>

				<li className={`${pathname === "/add-question" ? "underline" : ""}   `}>
					{" "}
					<Link to="/add-question">Ask a Question</Link>
				</li>
				<li className="items-center">
					{plug.isConnected ? (
						<div className=" w-40 flex justify-center ">
							<div className="flex justify-center">
								<img
									className="w-10 h-10 rounded-full ring-2 ring-gray-300"
									src={plug.avatar}
									alt=""
								/>
							</div>
						</div>
					) : (
						<div className="">
							<button onClick={login} className="my-button ">
								Log in
							</button>
						</div>
					)}
				</li>
			</ul>
		</div>
	);
};

export default Header;
