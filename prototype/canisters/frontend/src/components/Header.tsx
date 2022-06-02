import { Link } from "react-router-dom";

const Header = ({ plug, login, logout }: any) => {
	return (
		<div className="w-screen h-[80px] bg-zinc-100 ">
			<div className="px-2 flex justify-between items-center w-full h-full">
				<div className="flex items-center">
					{" "}
					<Link to="/">
						<h1 className="text-3xl font-bold mr-4 text-slate-700"> Home</h1>
					</Link>
				</div>
				<div className="flex pr-4 items-center ">
					<ul className="flex ">
						{plug.isConnected ? (
							<Link to="/interactions">
								<li className="p-4">My Interactions</li>
							</Link>
						) : (
							<></>
						)}

						<Link to="/">
							<li className="p-4">Add Question</li>
						</Link>
						<Link to="/questions">
							<li className="p-4">Browse Questions</li>
						</Link>
					</ul>
					{plug.isConnected ? (
						<button
							onClick={logout}
							className="px-6 py-2  cursor-pointer bg-slate-50 rounded-full"
						>
							Log out
						</button>
					) : (
						<button
							onClick={login}
							className="px-6 py-2  cursor-pointer bg-slate-50 rounded-full"
						>
							{" "}
							Log in
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default Header;
