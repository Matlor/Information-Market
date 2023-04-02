import React from "react";
import Answer from "../../components/question/Answer";
import { RewardTag } from "../../components/core/Tag";
import Button from "../../components/core/Button";

export default {
	title: "question/Answer",
	component: Answer,
};

const Template = (args) => <Answer {...args} />;

export const Default = Template.bind({});
Default.args = {
	author_id: "1",
	content:
		"<p>This is the answer content. This is the answer content. This is the answer content. This is the answer content.This is the answer content.This is the answer content.</p>",
	tag: <RewardTag reward={3.11} />,
	action: (
		<Button
			size="md"
			arrow={true}
			color="gray"
			text="Dispute"
			onClick={() => {}}
		/>
	),
	timeStamp: "30",
};
