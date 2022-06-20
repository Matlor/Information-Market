import { Link, useLocation } from "react-router-dom";

const Header = ({ plug, login, user }: any) => {
	let { pathname } = useLocation();

	return (
		<nav className="bg-primary border-gray-200 px-2 sm:px-4 py-2.5">
		<div className="container flex flox-row justify-between items-center mx-auto">
			<Link to="/">
				<div className="flex flex-row items-center">
					<div className="w-2"></div>
					<span className="self-center text-2xl font-semibold whitespace-nowrap ">
						Leap
					</span>
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
							<Link to="/profile">
								<img className="w-12 h-12 rounded-full ring-2 ring-gray-300" src={user.avatar} alt=""/>
							</Link>
						</div>
					) : (
						<div className="w-40 flex justify-center items-center">
							<button onClick={login} className="my-button bg-secondary hover:bg-primary">
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
