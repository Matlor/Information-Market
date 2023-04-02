import React from "react";
import { Meta } from "@storybook/react";
import Loading from "../../components/core/Loading";

export default {
	title: "Core/Loading",
	component: Loading,
} as Meta;

export const FilledLoading = () => <Loading style="filled" />;
FilledLoading.storyName = "Filled";

export const EmptyLoading = () => <Loading style="empty" />;
EmptyLoading.storyName = "Empty";

export const LoadingAnimation = () => <Loading style="loading" />;
LoadingAnimation.storyName = "Loading";
