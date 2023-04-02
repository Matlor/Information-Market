import React from "react";
import { Meta, Story } from "@storybook/react";
import { Profile, ProfilePicture } from "../../components/core/Profile";
import { Principal } from "@dfinity/principal";

export default {
	title: "Core/Profile",
	component: Profile,
} as Meta;

const Template = (args) => <Profile {...args} />;

const principal = Principal.fromText("aaaaa-aa");

export const UserProfile = Template.bind({});
UserProfile.args = {
	principal,
	name: "John Doe",
	minutes: 25,
};

export const ProfilePictureStory: Story = () => (
	<ProfilePicture principal={principal} size={32} />
);
ProfilePictureStory.storyName = "Profile Picture";
