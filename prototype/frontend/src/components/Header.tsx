const Header = () => {
	return (
		<>
			<div className="w-screen h-[80px] bg-zinc-100 ">
				<div className="px-2 flex justify-between items-center w-full h-full">
					<div className="flex items-center">
						{" "}
						<h1 className="text-3xl font-bold mr-4 text-slate-700"> Home</h1>
					</div>
					<div className="flex pr-4">
						<ul className="flex ">
							<li className="p-4">Add Question</li>
							<li className="p-4">Browse Questions</li>
						</ul>

						<button className="px-6 py-2  cursor-pointer bg-slate-50 rounded-full">
							Log in
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

/* 
	<a href="#" className="text-left ">
					<h1 className="text-3xl text-left font-bold ">Home</h1>
				</a>
				<h1 className="text-3xl text-right font-bold ">Login</h1>

*/
export default Header;
