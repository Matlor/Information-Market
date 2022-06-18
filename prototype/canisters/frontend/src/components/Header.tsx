import { Link, useLocation } from "react-router-dom";

const Header = ({ plug, login }: any) => {
	let { pathname } = useLocation();

	return (
		<nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5">
		<div className="container flex flox-row justify-between items-center mx-auto">
			<Link to="/">
				<div className="flex flex-row items-center">
					<img src="rdf.svg" className="w-10 h-10" alt="Logo" />
					<div className="w-2"></div>
					<span className="self-center text-xl font-semibold whitespace-nowrap">Information market</span>
				</div>
			</Link>
			<div className="flex flex-row">
				<ul className="flex flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
					<li className={` ${pathname === "/" ? "font-bold" : ""} p-4 mr-4`}>
						<Link to="/">Browse Questions</Link>
					</li>
					<li className={`${pathname === "/add-question" ? "font-bold" : ""} p-4 mr-8`}>
						<Link to="/add-question">Ask a Question</Link>
					</li>
				</ul>
				<div className="flex justify-end ml-20">
					{plug.isConnected ? (
					<div className="w-40 flex">
						<img className="w-10 h-10 rounded-full ring-2 ring-gray-300" src={plug.avatar} alt=""/>
					</div>
					) : (
						<div className="w-40 flex">
							<button onClick={login} className="my-button ">
								Log in
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	</nav>
	);
};

export default Header;
