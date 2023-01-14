import { Principal } from "@dfinity/principal";
import { Answer as IAnswer } from "../../../../declarations/market/market.did.d";
import { FQuestion } from "../../../screens/Question";

export const calcUserRole = (
	question: FQuestion | undefined,
	answers: IAnswer[],
	principal: Principal | undefined
) => {
	const isAnswerAuthor = () => {
		for (let i = 0; i < answers.length; i++) {
			if (answers[i].author_id === principal) {
				return true;
			}
		}
		return false;
	};

	if (!principal) {
		return "isNotLoggedIn";
	} else if (!question) {
		return "isNone";
	} else if (question.author_id === principal) {
		return "isQuestionAuthor";
	} else if (isAnswerAuthor()) {
		return "isAnswerAuthor";
	} else {
		return "none";
	}
};
