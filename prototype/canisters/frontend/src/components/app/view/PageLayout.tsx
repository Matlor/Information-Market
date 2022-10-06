import Footer from "./Footer";
import Header from "./Header";

const PageLayout = ({ isConnected, login, logout, avatar, children }) => {
	return (
		<div className="pt-[47px] pb-[78px] px-[131px] min-h-screen flex flex-col justify-between bg-colorBackground">
			<Header
				isConnected={isConnected}
				login={login}
				logout={logout}
				avatar={avatar}
			/>
			<div className="mt-[101px] mb-[101px] gap-[78px] flex-1 flex flex-col  items-center">
				{children}
			</div>
			<Footer />
		</div>
	);
};

export default PageLayout;
