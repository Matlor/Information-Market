import Header from "./Header.jsx";
import Footer from "./Footer";

const PageLayout = ({ children }) => {
	return (
		<div className="p-[103px] flex flex-col gap-[103px] justify-start items-center bg-colorBackground">
			<Header />
			{children}

			<Footer />
		</div>
	);
};

export default PageLayout;
