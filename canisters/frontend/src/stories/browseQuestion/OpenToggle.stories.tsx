import React, { useState } from "react";
import OpenToggle from "../../components/browseQuestion/OpenToggle";

export default {
	title: "browseQuestion/OpenToggle",
	component: OpenToggle,
};

const Template = (args) => {
	const { isOn, toggleStatus } = args;
	return <OpenToggle isOn={isOn} toggleStatus={toggleStatus} />;
};

export const Default = Template.bind({});
Default.args = {
	isOn: false,
	toggleStatus: (isChecked) => console.log(`Checked: ${isChecked}`),
};
