import React from "react";

import SlateEditor from "../../addQuestion/view/SlateEditor";
import Button from "../../core/view/Button";
import { Mail } from "../../addQuestion/services/mail";

// TODO: Add error and loading handling
const SlateSubmit = ({
	currentStatus,
	currentUserRole,
	slateInput,
	setSlateInput,
	propFunction,
}) => {
	const currentCase = currentStatus + "." + currentUserRole;

	// Just to send mail, otherwise I'd pass the propFunction directly
	const submitHandler = async () => {
		await propFunction();
		await Mail("new answer");
	};

	const showEditor = (
		<div data-cy="SlateSubmit">
			<SlateEditor
				inputValue={slateInput}
				setInputValue={setSlateInput}
				placeholder="Answer here..."
			/>
			<div className="mt-[17px]">
				<Button text={"Submit"} propFunction={submitHandler} />
			</div>
		</div>
	);

	switch (currentCase) {
		case "OPEN.isQuestionAuthor":
			return <></>;
		case "OPEN.isAnswerAuthor":
			return showEditor;
		case "OPEN.isNone":
			return showEditor;
		case "OPEN.isNotLoggedIn":
		default:
			return <></>;
	}
};

export default SlateSubmit;
