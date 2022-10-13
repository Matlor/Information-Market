import SlateEditor from "../../addQuestion/view/SlateEditor";
import ButtonSmall from "../../core/view/ButtonSmall";

// TODO: Add error and loading handling
const SlateSubmit = ({
	currentStatus,
	currentUserRole,
	slateInput,
	setSlateInput,
	propFunction,
}) => {
	const currentCase = currentStatus + "." + currentUserRole;

	const wrapper = (child) => {
		return (
			<div data-cy="SlateSubmit">
				<SlateEditor
					inputValue={slateInput}
					setInputValue={setSlateInput}
					placeholder="Answer here..."
				/>
				<div className="mt-[17px]">{child}</div>
			</div>
		);
	};

	switch (currentCase) {
		case "OPEN.isQuestionAuthor":
			break;
		case "OPEN.isAnswerAuthor":
			return wrapper(
				<ButtonSmall
					text={"Submit"}
					propFunction={propFunction}
					loading={true}
				/>
			);
		case "OPEN.isNone":
			return wrapper(
				<ButtonSmall
					text={"Submit"}
					propFunction={propFunction}
					loading={true}
				/>
			);
		case "OPEN.isNotLoggedIn":
			return wrapper(<div className="heading3 mb-5 ">Log in to answer</div>);

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
