import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";
import UIQuestion, {
	UIQuestionProps,
} from "../../components/question/UIQuestion";
import { List, Page } from "../../components/app/Layout";

import { Principal } from "@dfinity/principal";

export default {
	title: "question/UIQuestion",
	component: UIQuestion,
} as Meta;

const UIQuestionStory: React.FC<Partial<UIQuestionProps>> = (props) => {
	const [selected, setSelected] = useState<string | null>(null);

	const selectProps = {
		selected,
		setSelected,
	};

	return (
		<Page Header={<div></div>}>
			<List>
				<UIQuestion {...props} select={selectProps} />
			</List>
		</Page>
	);
};

const Template: Story<UIQuestionProps> = (args) => (
	<UIQuestionStory {...args} />
);

const exampleAuthor = {
	id: Principal.fromText(
		"4x6qx-tmjtk-uzyzt-ihfyt-3xeeg-aml4y-5v64i-v6u3x-scyy2-mobv5-pae"
	),
	name: "John Doe",
};

const question = {
	id: "1",
	status: { OPEN: null },
	reward: 510000000,
	title:
		"What challenges did you face and what were your key learnings from this?What challenges did you face and what were your key learnings from this?What challenges did you face and what were your key learnings from this?What challenges did you face and what were your key learnings from this?",
	content:
		"Also mention to Andrew that guys in Microsoft send us positive request. Also mention to Andrew that guys in Microsoft send us positive request Also mention to Andrew that guys in Microsoft send us positive request Also mention to Andrew that guys in Microsoft send us positive request Also mention to Andrew that guys in Microsoft send us positive request.",
	invoice_id: "0",
	answers: ["1", "2"],
	status_end_date: Math.floor(Date.now() / 1000) / 60 + 100,
	status_update_date: Math.floor(Date.now() / 1000) / 60 - 10,
	finalWinner: "1",
	author_id: exampleAuthor.id,
	close_transaction_block_height: [],
	open_duration: 604800, // 1 week in seconds
	potentialWinner: "1",
	creation_date: Math.floor(Date.now() / 1000) / 60 - 100,
};

const answers = [
	{
		id: "1",
		content:
			"test answerAlso mention to Andrew that guys in Microsoft send us positive request. Also mention to Andrew that guys in Microsoft send us positive request Also mention to Andrew that guys in Microsoft send us positive request Also mention to Andrew that guys in Microsoft send us positive request Also mention to Andrew that guys in Microsoft send us positive request.",
		author_id: "2",
		creation_date: 15,
	},
	{
		id: "2",
		content:
			"Also mention to Andrew that guys in Microsoft send us positive request. Also mention to Andrew that guys in Microsoft send us positive request Also mention to Andrew that guys in Microsoft send us positive request Also mention to Andrew that guys in Microsoft send us positive request Also mention to Andrew that guys in Microsoft send us positive request.",
		author_id: "1",
		creation_date: 15,
	},
];

const users = [
	{
		id: "1",
		name: "Alice",
	},
	{
		id: "2",
		name: "Bob",
	},
];

const answerInputProps = {
	answerInput: "",
	setAnswerInput: (input: string) => console.log(input),
};

const selectProps = {
	selected: null,
	setSelected: (id: string) => console.log(id),
};

const currentUser = {
	id: "3",
	name: "Charlie",
	market: {
		answer_question: async (questionId: string, content: string) => {
			console.log("Answer question:", questionId, content);
		},
		pick_answer: async (questionId: string, answerId: string) => {
			console.log("Pick answer:", questionId, answerId);
		},
		dispute: async (questionId: string) => {
			console.log("Dispute:", questionId);
		},
	},
};

export const GetAnswers = Template.bind({});
GetAnswers.args = {
	question,
	answers,
	users,
	answer: answerInputProps,
	select: selectProps,
	viewCase: "getAnswers",
	user: currentUser,
};

export const Answer = Template.bind({});
Answer.args = {
	question,
	answers,
	users,
	answer: answerInputProps,
	select: selectProps,
	viewCase: "answer",
	user: currentUser,
};

export const ConnectToAnswer = Template.bind({});
ConnectToAnswer.args = {
	question,
	answers,
	users,
	answer: answerInputProps,
	select: selectProps,
	viewCase: "connectToAnswer",
	user: currentUser,
};

export const Pick = Template.bind({});
Pick.args = {
	question,
	answers,
	users,
	answer: answerInputProps,
	viewCase: "pick",
	user: currentUser,
};

export const Dispute = Template.bind({});
Dispute.args = {
	question,
	answers,
	users,
	answer: answerInputProps,
	select: selectProps,
	viewCase: "dispute",
	user: currentUser,
};

export const Ongoing = Template.bind({});
Ongoing.args = {
	question,
	answers,
	users,
	answer: answerInputProps,
	select: selectProps,
	viewCase: "ongoing",
	user: currentUser,
};

export const Closed = Template.bind({});
Closed.args = {
	question,
	answers,
	users,
	answer: answerInputProps,
	select: selectProps,
	viewCase: "closed",
	user: currentUser,
};
