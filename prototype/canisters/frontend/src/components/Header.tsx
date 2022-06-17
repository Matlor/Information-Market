import { Link, useLocation } from "react-router-dom";

const Header = ({ plug, login, logout }: any) => {
	let { pathname } = useLocation();

	return (
		<div className=" mr-10 ml-10 h-[110px] pt-16 pb-12 flex justify-end items-center font-medium ">
			<ul className="flex mr-20   ">
				<li className={` ${pathname === "/" ? "underline" : ""} p-4 mr-8`}>
					{" "}
					<Link to="/">Browse Questions </Link>
				</li>

				<li
					className={`${
						pathname === "/add-question" ? "underline" : ""
					} p-4 mr-8`}
				>
					{" "}
					<Link to="/add-question">Ask a Question</Link>
				</li>
			</ul>
			{plug.isConnected ? (
				<div className=" w-40 flex justify-center">
					<div className="flex justify-center">
						<img className="w-10 h-10 rounded-full ring-2 ring-gray-300" src={plug.avatar} alt=""/>
					</div>
				</div>
			) : (
				<div className="w-40 flex justify-center">
					<button onClick={login} className="my-button ">
						Log in
					</button>
				</div>
			)}
		</div>
	);
};

export default Header;
