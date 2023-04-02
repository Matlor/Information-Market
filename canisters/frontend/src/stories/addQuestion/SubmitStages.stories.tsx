import React from "react";
import { Meta } from "@storybook/react";
import {
	SubmitStages,
	SubmitStagesText,
} from "../../components/addQuestion/SubmitStages";

export default {
	title: "addQuestion/SubmitStages",
	component: SubmitStages,
} as Meta;

export const Default = () => <SubmitStages stages="" />;
export const Invoice = () => <SubmitStages stages="invoice" />;
export const Transfer = () => <SubmitStages stages="transfer" />;
export const Submitting = () => <SubmitStages stages="submit" />;
export const Success = () => <SubmitStages stages="success" />;
export const Error = () => <SubmitStages stages="error" />;
