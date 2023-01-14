import React, { useContext } from "react";
import SlateEditor from "../addQuestion/SlateEditor";
import Button from "../core/Button";
import { Mail } from "../addQuestion/mail";

import { Market as IMarket } from "../../../declarations/market/market.did.d";
import { ActorContext } from "../api/Context";

interface ISlateSubmit {
	currentCase: string;
	Input: {
		slateInput: string;
		setSlateInput: React.Dispatch<React.SetStateAction<string>>;
		question_id: string;
	};
}

const SlateSubmit = ({ currentCase, Input }: ISlateSubmit) => {
	// --------------------  Context --------------------
	const { user } = useContext(ActorContext);

	const showEditor = (
		<div data-cy="SlateSubmit">
			<SlateEditor
				inputValue={Input.slateInput}
				setInputValue={Input.setSlateInput}
				placeholder="Answer here..."
			/>
			<div className="mt-[17px]">
				<Button
					text={"Submit"}
					propFunction={async () => {
						await user.market.answer_question(
							Input.question_id,
							Input.slateInput
						);
						Mail("new answer");
					}}
				/>
			</div>
		</div>
	);

	// TODO: Completely restructure the user Role to be type sensitive
	switch (currentCase) {
		case "OPEN.isAnswerAuthor":
			return showEditor;
		case "OPEN.isNone":
			return showEditor;
		default:
			return <></>;
	}
};

export default SlateSubmit;
