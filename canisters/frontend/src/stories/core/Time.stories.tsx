import React from "react";
import { Meta, Story } from "@storybook/react";
import { TimeLeft, TimeStamp } from "../../components/core/Time";

export default {
	title: "core/Time",
} as Meta;

export const TimeLeftWithIcon: Story = (args) => <TimeLeft {...args} />;
TimeLeftWithIcon.args = {
	minutes: Math.floor(Date.now() / 1000) / 60 + 10,
	icon: true,
};

export const TimeLeftWithoutIcon: Story = (args) => <TimeLeft {...args} />;
TimeLeftWithoutIcon.args = {
	minutes: Math.floor(Date.now() / 1000) / 60 + 10,
	icon: false,
};

export const TimeStampTest: Story = (args) => <TimeStamp {...args} />;
TimeStampTest.args = {
	minutes: Math.floor(Date.now() / 1000) / 60 - 10,
};
