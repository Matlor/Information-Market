import React from "react";
import { Story, Meta } from "@storybook/react";

import Footer from "../../components/app/Footer";

export default {
	title: "app/Footer",
	component: Footer,
} as Meta;

const Template: Story = () => <Footer />;

export const Default = Template.bind({});
