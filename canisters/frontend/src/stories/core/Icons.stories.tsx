import React from "react";
import { Meta } from "@storybook/react";
import {
	BellIcon,
	ClockIcon,
	SearchIcon,
	AnswerIcon,
	SettingsIcon,
	ArrowIcon,
	CrossIcon,
	TriangleIcon,
	OnIcon,
	OngoingIcon,
	ClosedIcon,
	LinkIcon,
	SortIcon,
} from "../../components/core/Icons";

export default {
	title: "core/Icons",
} as Meta;

export const BellIconStory = (args) => <BellIcon {...args} />;
BellIconStory.storyName = "Bell Icon";
BellIconStory.args = {
	size: 20,
	fillColor: "transparent",
	borderColor: "black",
	strokeWidth: 0.8,
};

export const ClockIconStory = (args) => <ClockIcon {...args} />;
ClockIconStory.storyName = "Clock Icon";
ClockIconStory.args = {
	size: 20,
	fillColor: "transparent",
	borderColor: "black",
	strokeWidth: 0.8,
};

export const SearchIconStory = (args) => <SearchIcon {...args} />;
SearchIconStory.storyName = "Search Icon";
SearchIconStory.args = {
	size: 20,
	fillColor: "transparent",
	borderColor: "black",
	strokeWidth: 0.8,
};

export const AnswerIconStory = (args) => <AnswerIcon {...args} />;
AnswerIconStory.storyName = "Answer Icon";
AnswerIconStory.args = {
	size: 20,
	fillColor: "transparent",
	borderColor: "black",
	strokeWidth: 0.8,
};

export const SettingsIconStory = (args) => <SettingsIcon {...args} />;
SettingsIconStory.storyName = "Settings Icon";
SettingsIconStory.args = {
	size: 20,
	fillColor: "transparent",
	borderColor: "black",
	strokeWidth: 0.8,
};

export const ArrowIconStory = (args) => <ArrowIcon {...args} />;
ArrowIconStory.storyName = "Arrow Icon";
ArrowIconStory.args = {
	size: 20,
	fillColor: "transparent",
	borderColor: "black",
	strokeWidth: 0.8,
};

export const CrossIconStory = (args) => <CrossIcon {...args} />;
CrossIconStory.storyName = "Cross Icon";
CrossIconStory.args = {
	size: 20,
	fillColor: "transparent",
	borderColor: "black",
	strokeWidth: 0.8,
};

export const TriangleIconStory = (args) => <TriangleIcon {...args} />;
TriangleIconStory.storyName = "Triangle Icon";
TriangleIconStory.args = {
	size: 20,
	fillColor: "transparent",
	borderColor: "black",
	strokeWidth: 0.8,
};

export const SortIconStory = (args) => <SortIcon {...args} />;
SortIconStory.storyName = "Sort Icon";
SortIconStory.args = {
	size: 20,
	fillColor1: "red",
	fillColor2: "blue",
	borderColor: "red",
	strokeWidth: 0.8,
};

export const OnIconStory = (args) => <OnIcon {...args} />;
OnIconStory.storyName = "On Icon";
OnIconStory.args = {
	size: 20,
	fillColor: "transparent",
	borderColor: "black",
	strokeWidth: 0.8,
};

export const OngoingIconStory = (args) => <OngoingIcon {...args} />;
OngoingIconStory.storyName = "Ongoing Icon";
OngoingIconStory.args = {
	size: 20,
	fillColor: "transparent",
	borderColor: "black",
	strokeWidth: 0.8,
};

export const ClosedIconStory = (args) => <ClosedIcon {...args} />;
ClosedIconStory.storyName = "Closed Icon";
ClosedIconStory.args = {
	size: 20,
	fillColor: "transparent",
	borderColor: "black",
	strokeWidth: 0.8,
};

export const LinkIconStory = (args) => <LinkIcon {...args} />;
LinkIconStory.storyName = "Link Icon";
LinkIconStory.args = {
	size: 20,
	fillColor: "transparent",
	borderColor: "black",
	strokeWidth: 0.8,
};

const AllIcons = (args) => (
	<div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
		<BellIcon {...args} {...args.BellIcon} />
		<ClockIcon {...args} {...args.ClockIcon} />
		<SearchIcon {...args} {...args.SearchIcon} />
		<AnswerIcon {...args} {...args.AnswerIcon} />
		<SettingsIcon {...args} {...args.SettingsIcon} />
		<ArrowIcon {...args} {...args.ArrowIcon} />
		<CrossIcon {...args} {...args.CrossIcon} />
		<TriangleIcon {...args} {...args.TriangleIcon} />
		<SortIconStory {...args} {...args.SortIcon} />
		<OngoingIcon {...args} {...args.OngoingIcon} />
		<ClosedIcon {...args} {...args.ClosedIcon} />
		<LinkIcon {...args} {...args.LinkIcon} />
	</div>
);

export const AllIconsStory = AllIcons.bind({});
AllIconsStory.storyName = "All Icons";
AllIconsStory.args = {
	size: 20,
	fillColor: "transparent",
	borderColor: "black",
	strokeWidth: 0.8,
	BellIcon: {},
	ClockIcon: {},
	SearchIcon: {},
	AnswerIcon: {},
	SettingsIcon: {},
	ArrowIcon: {},
	CrossIcon: {},
	TriangleIcon: {},
	SortIcon: {},
	OngoingIcon: {},
	ClosedIcon: {},
	LinkIcon: {},
};
