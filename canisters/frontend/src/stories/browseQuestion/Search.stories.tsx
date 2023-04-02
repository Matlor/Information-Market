import React, { useState } from "react";
import Search from "../../components/browseQuestion/Search";

export default {
	title: "browseQuestion/Search",
	component: Search,
};

const Template = (args) => {
	const [searchedText, setSearchedText] = useState("");

	return <Search {...args} setSearchedText={setSearchedText} />;
};

export const Default = Template.bind({});
Default.args = {
	searchLoading: false,
};
