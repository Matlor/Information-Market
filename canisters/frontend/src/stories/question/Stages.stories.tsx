import React from "react";
import { Story, Meta } from "@storybook/react";
import Stages from "../../components/question/Stages";

export default {
	title: "question/Stages",
} as Meta;

const Template: Story = (args) => <Stages {...args} />;

export const OpenStage = Template.bind({});
OpenStage.args = {
	stage: "open",
};

export const OngoingStage = Template.bind({});
OngoingStage.args = {
	stage: "ongoing",
};

export const ClosedStage = Template.bind({});
ClosedStage.args = {
	stage: "closed",
};
