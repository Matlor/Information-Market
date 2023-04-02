import React from "react";
import Submit from "../../components/addQuestion/Submit";

export default {
	title: "addQuestion//Submit",
	component: Submit,
};

const Template = (args) => <Submit {...args} />;

export const Default = Template.bind({});
Default.args = {
	inputs: {
		reward: "100",
		duration: "3600",
		title: "Sample Title",
		content: "Sample Content",
	},
	loggedInUser: {
		market: {
			create_invoice: async () => ({ ok: { invoice: { id: "invoice-id" } } }),
			ask_question: async () => ({ ok: { id: "question-id" } }),
		},
		ledger: {
			transfer: async () => ({ Ok: {} }),
		},
	},
};
