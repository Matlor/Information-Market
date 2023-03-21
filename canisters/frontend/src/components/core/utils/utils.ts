import { Principal } from "@dfinity/principal";
import {
	Answer as IAnswer,
	User as IUser,
} from "../../../../declarations/market/market.did.d";
import { FQuestion } from "../../../screens/Question_old";

export const user_from_answer_id = (
	answer_id: string | undefined,
	answers,
	users
): IUser | undefined => {
	if (!answer_id) {
		return;
	}
	let answer = get_answer_from_id(answer_id, answers);
	if (!answer) {
		return;
	} else {
		let user = get_user_from_id(answer.author_id, users);
		if (!user) {
			return;
		} else {
			return user;
		}
	}
};

export const get_user_from_id = (
	author_id: Principal | undefined,
	users: IUser[]
): IUser | undefined => {
	if (!author_id) return undefined;
	return users.find((user) => user.id.toString() === author_id.toString());
};

export const get_answer_from_id = (
	answer_id: string | undefined,
	answers: IAnswer[]
): IAnswer | undefined => {
	if (!answer_id) return undefined;
	return answers.find((answer) => answer.id === answer_id);
};

export const get_str_user_from_principals = (
	author_id: string | undefined,
	users: IUser[]
): IUser | undefined => {
	if (!author_id) {
		return undefined;
	} else {
		return users.find((user) => user.id.toString() === author_id);

		//user.id.toString() === author_id);
	}
};

export const calcUserRole = (
	question: FQuestion | undefined,
	answers: IAnswer[],
	principal: Principal | undefined
) => {
	const isAnswerAuthor = () => {
		for (let i = 0; i < answers.length; i++) {
			if (!principal) {
				return false;
			}
			if (answers[i].author_id.toString() === principal.toString()) {
				return true;
			}
		}

		return false;
	};

	if (!principal) {
		return "isNotLoggedIn";
	} else if (!question) {
		return "isNone";
	} else if (question.author_id.toString() === principal.toString()) {
		return "isQuestionAuthor";
	} else if (isAnswerAuthor()) {
		return "isAnswerAuthor";
	} else {
		return "isNone";
	}
};

export const getUserFromAnswer = (
	answer_id: string | undefined,
	answers: IAnswer[],
	users: IUser[]
): IUser | undefined => {
	if (!answer_id) return undefined;

	const author_id = answers.find(
		(answer) => answer.id === answer_id
	)?.author_id;
	const user = users.find((user) => user.id === author_id);
	return user;
};

export const deadlineToConutdown = (
	deadlineInSeconds: number
): { days: number; hours: number; minutes: number } => {
	const now = Date.now() / 1000;
	const totalSeconds = deadlineInSeconds - now;

	const totalMinutes = Math.max(0, totalSeconds) / 60;

	const floatDays = totalMinutes / 60 / 24;
	const days = Math.floor(totalMinutes / 60 / 24);
	const dayRemainder = floatDays - days;

	const floatHours = dayRemainder * 24;
	const hours = Math.floor(floatHours);

	const hourRemainder = floatHours - hours;
	const floatMinutes = hourRemainder * 60;
	const minutes = Math.round(floatMinutes);
	return { days, hours, minutes };
};

// todo: does it need !question?
// todo: should I add !answers?
export const defineRole = (principal, question, answers) => {
	//console.log("defineRole, principal", principal.toString());
	//console.log("defineRole, question", question.author_id.toString());

	if (!principal) {
		return "anonymous";
	} else if (!question) {
		return "unrelated";
	} else if (question.author_id.toString() === principal.toString()) {
		return "author";
	} else if (
		answers.some(
			(answer) => answer.author_id.toString() === principal.toString()
		)
	) {
		return "answerer";
	} else {
		return "unrelated";
	}
};

// OLD
/* import { Principal } from "@dfinity/principal";
import { Answer as IAnswer } from "../../../../declarations/market/market.did.d";
import { FQuestion } from "../../../screens/Question";

export const calcUserRole = (
	question: FQuestion | undefined,
	answers: IAnswer[],
	principal: Principal | undefined
): "isQuestionAuthor" | "isAnswerAuthor" | "isNone" | "isNotLoggedIn" => {
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
		return "isNone";
	}
};
 */
