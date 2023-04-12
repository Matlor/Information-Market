import React from "react";
import { Meta } from "@storybook/react";
import {
	ShowStages,
	SubmitStagesText,
} from "../../components/addQuestion/Stages";

export default {
	title: "addQuestion/SubmitStages",
	component: ShowStages,
} as Meta;

export const Invoice = () => <ShowStages stages="invoice" />;
export const Transfer = () => <ShowStages stages="transfer" />;
export const Submitting = () => <ShowStages stages="submit" />;
export const Success = () => <ShowStages stages="success" />;
