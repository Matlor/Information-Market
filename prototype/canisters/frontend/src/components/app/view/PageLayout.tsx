import Footer from "./Footer";
import Header from "./Header";

const PageLayout = ({ isConnected, login, logout, avatar, children }) => {
	return (
		<div className="p-[103px] min-h-screen flex flex-col justify-between bg-colorBackground">
			<Header
				isConnected={isConnected}
				login={login}
				logout={logout}
				avatar={avatar}
			/>
			<div className="my-[103px] flex-1 flex flex-col gap-[103px] items-center">
				{children}
			</div>
			<Footer />
		</div>
	);
};

export default PageLayout;
