import SlateEditor from "../../addQuestion/view/SlateEditor";
import Button from "../../core/view/Button";

// TODO: Add error and loading handling
const SlateSubmit = ({
	currentStatus,
	currentUserRole,
	slateInput,
	setSlateInput,
	propFunction,
}) => {
	const currentCase = currentStatus + "." + currentUserRole;

	const showEditor = (
		<div data-cy="SlateSubmit">
			<SlateEditor
				inputValue={slateInput}
				setInputValue={setSlateInput}
				placeholder="Answer here..."
			/>
			<div className="mt-[17px]">
				<Button text={"Submit"} propFunction={propFunction} />
			</div>
		</div>
	);

	switch (currentCase) {
		case "OPEN.isQuestionAuthor":
			break;
		case "OPEN.isAnswerAuthor":
			return showEditor;
		case "OPEN.isNone":
			return showEditor;
		case "OPEN.isNotLoggedIn":
			return;

		case "PICKANSWER.isQuestionAuthor":
			break;
		case "PICKANSWER.isAnswerAuthor":
			break;
		case "PICKANSWER.isNone":
			break;
		case "PICKANSWER.isNotLoggedIn":
			break;

		case "DISPUTABLE.isQuestionAuthor":
			break;
		case "DISPUTABLE.isAnswerAuthor":
			break;
		case "DISPUTABLE.isNone":
			break;
		case "DISPUTABLE.isNotLoggedIn":
			break;

		case "DISPUTED.isQuestionAuthor":
			break;
		case "DISPUTED.isAnswerAuthor":
			break;
		case "DISPUTED.isNone":
			break;
		case "DISPUTED.isNotLoggedIn":
			break;

		case "CLOSED.isQuestionAuthor":
			break;
		case "CLOSED.isAnswerAuthor":
			break;
		case "CLOSED.isNone":
			break;
		case "CLOSED.isNotLoggedIn":
			break;

		default:
			return;
	}
};

export default SlateSubmit;
