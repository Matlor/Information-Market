import SlateEditor from "../../addQuestion/view/SlateEditor";
import ButtonSmall from "../../core/view/ButtonSmall";

import { checkIfCaseTrue } from "../services/cases";

// TODO: Add error and loading handling
const SlateSubmit = ({
	currentStatus,
	currentUserRole,
	slateInput,
	setSlateInput,
	propFunction,
	isLoggedIn,
}) => {
	// only for Slate the user role none does not cover the notLoggedIn case
	// this if statement is not consistent with the logic of the cases
	if (currentStatus === "OPEN" && !isLoggedIn) {
		return (
			<>
				<SlateEditor inputValue={slateInput} setInputValue={setSlateInput} />
				<div className="heading3-18px mt-5 mb-5 ">Log in to answer</div>
			</>
		);
	}
	if (checkIfCaseTrue("OPEN", "answerAuthor", currentStatus, currentUserRole)) {
		return (
			<>
				<SlateEditor inputValue={slateInput} setInputValue={setSlateInput} />
				<div className="mt-5 mb-5">
					<ButtonSmall
						text={"Submit"}
						propFunction={propFunction}
						loading={true}
					/>
				</div>
			</>
		);
	} else if (checkIfCaseTrue("OPEN", "none", currentStatus, currentUserRole)) {
		return (
			<>
				<SlateEditor inputValue={slateInput} setInputValue={setSlateInput} />
				<div className="mt-5 mb-5">
					<ButtonSmall
						text={"Submit"}
						propFunction={propFunction}
						loading={true}
					/>
				</div>
			</>
		);
	}
};

export default SlateSubmit;
