import "./Header.css";

const Header = () => {
	return (
		<>
			<div className="header">
				<div className="left-align">
					<a href="#">
						<h3>Home</h3>
					</a>
				</div>

				<div className="right-align">
					<h3>Login</h3>
				</div>
			</div>
		</>
	);
};

export default Header;
