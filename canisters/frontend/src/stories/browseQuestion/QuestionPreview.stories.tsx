import React from "react";
import { Story, Meta } from "@storybook/react";

import QuestionPreview, {
	QuestionPreviewProps,
} from "../../components/browseQuestion/QuestionPreview";
import { Principal } from "@dfinity/principal";
import { Question } from "../../../declarations/market/market.did.d";

export default {
	title: "browseQuestion/QuestionPreview",
	component: QuestionPreview,
} as Meta;

const Template: Story<QuestionPreviewProps> = (args) => (
	<QuestionPreview {...args} />
);

const exampleAuthor = {
	id: Principal.fromText(
		"4x6qx-tmjtk-uzyzt-ihfyt-3xeeg-aml4y-5v64i-v6u3x-scyy2-mobv5-pae"
	),
	name: "John Doe",
};

const exampleQuestion: Question = {
	id: "0",
	status: { OPEN: null },
	reward: 510000000,
	title:
		"What challenges did you face and what were your key learnings from this?What challenges did you face and what were your key learnings from this?What challenges did you face and what were your key learnings from this?What challenges did you face and what were your key learnings from this?",
	content: "Example question content",
	invoice_id: "0",
	answers: ["1", "2"],
	status_end_date: Math.floor(Date.now() / 1000) / 60 + 100,
	status_update_date: Math.floor(Date.now() / 1000) / 60 - 10,
	finalWinner: [],
	author_id: exampleAuthor.id,
	close_transaction_block_height: [],
	open_duration: 604800, // 1 week in seconds
	potentialWinner: [],
	creation_date: Math.floor(Date.now() / 1000) / 60 - 100,
};

export const Open = Template.bind({});
Open.args = {
	question: exampleQuestion,
	author: exampleAuthor,
};

export const PickAnswer = Template.bind({});
PickAnswer.args = {
	question: { ...exampleQuestion, status: { PICKANSWER: null } },
	author: exampleAuthor,
};

export const Disputable = Template.bind({});
Disputable.args = {
	question: { ...exampleQuestion, status: { DISPUTABLE: null } },
	author: exampleAuthor,
};

export const Arbitration = Template.bind({});
Arbitration.args = {
	question: { ...exampleQuestion, status: { ARBITRATION: null } },
	author: exampleAuthor,
};

export const Payout = Template.bind({});
Payout.args = {
	question: { ...exampleQuestion, status: { PAYOUT: { PAY: null } } },
	author: exampleAuthor,
};

export const PayoutOngoing = Template.bind({});
PayoutOngoing.args = {
	question: { ...exampleQuestion, status: { PAYOUT: { ONGOING: null } } },
	author: exampleAuthor,
};

export const Closed = Template.bind({});
Closed.args = {
	question: { ...exampleQuestion, status: { CLOSED: null } },
	author: exampleAuthor,
};
