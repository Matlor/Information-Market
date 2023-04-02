import React from "react";
import Logo from "../../components/app/Logo";

export default {
	title: "app/Logo",
	component: Logo,
};

const Template = (args) => <Logo {...args} />;

export const Default = Template.bind({});
Default.args = {};
