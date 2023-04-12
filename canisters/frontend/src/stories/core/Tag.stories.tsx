import React from "react";
import { Meta, Story } from "@storybook/react";
import {
	RewardTag,
	RewardIconTag,
	SelectedTag,
	LoginToSubmitTag,
} from "../../components/core/Tag";

export default {
	title: "core/Tag",
} as Meta;

const RewardTagTemplate: Story = (args) => <RewardTag {...args} />;
const RewardIconTagTemplate: Story = (args) => <RewardIconTag {...args} />;
const SelectedTagTemplate: Story = (args) => <SelectedTag {...args} />;
const LoginToSubmitTagTemplate: Story = (args) => (
	<LoginToSubmitTag {...args} />
);

export const Reward = RewardTagTemplate.bind({});
Reward.args = {
	reward: 3.22,
};

export const RewardIcon = RewardIconTagTemplate.bind({});
RewardIcon.args = {
	reward: 3.22,
};

export const Selected = SelectedTagTemplate.bind({});
Selected.args = {};

export const LoginToSubmit = LoginToSubmitTagTemplate.bind({});
LoginToSubmit.args = {};
