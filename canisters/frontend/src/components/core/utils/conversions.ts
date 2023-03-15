import {
	FinalWinner as IFinalWinner,
	Question as IQuestion,
} from "../../../../declarations/market/market.did.d";
// TODO: should rather import from type file
import { FQuestion } from "../../../screens/Question_old";
import { fromNullable } from "@dfinity/utils";
import { QuestionStatus } from "../../../../declarations/market/market.did.d";

export const getFinalWinnerId = (
	finalWinner: IFinalWinner | undefined,
	question_id: string
): string | undefined => {
	if (finalWinner === undefined) {
		return undefined;
	} else if ("ANSWER" in finalWinner) {
		return finalWinner.ANSWER.answer_id;
	} else {
		return question_id;
	}
};

export const toFrontendQuestion = (question: IQuestion): FQuestion => {
	return {
		...question,
		finalWinner: fromNullable(question.finalWinner),
		close_transaction_block_height: fromNullable(
			question.close_transaction_block_height
		),
		potentialWinner: fromNullable(question.potentialWinner),
	};
};

export const e3sToIcp = (e3s: number): number => {
	return e3s / 1000;
};

export const icpToE3s = (icp: number): number => {
	return icp * 1000;
};

export const e8sToIcp = (e8s: number): number => {
	return Number(e8s) / 10 ** 8;
};

export const icpToE8s = (icp: number): bigint => {
	// TODO: do multiplication outside bigint, it currently fails because not supported by target env
	return BigInt(icp * 10 ** 8);
};

// TODO: why number and not bigInt?
export const e8sToE3s = (num: number): number => {
	return num / 100000;
};
// TODO: why number and not bigInt?
export const e3sToE8s = (num: number): number => {
	return num * 100000;
};

// TODO: what's the input here?
export const moStatusToString = (
	status: QuestionStatus
):
	| "OPEN"
	| "PICKANSWER"
	| "DISPUTABLE"
	| "ARBITRATION"
	| "PAYOUT"
	| "CLOSED" => {
	return Object.keys(status)[0];
};

export const capitalStatusToReadable = (
	status: "OPEN" | "PICKANSWER" | "DISPUTABLE" | "ARBITRATION" | "CLOSED"
):
	| "Open"
	| "Winner Selection"
	| "Open for Disputes"
	| "Arbitration"
	| "Closed" => {
	switch (status) {
		case "OPEN":
			return "Open";
		case "PICKANSWER":
			return "Winner Selection";
		case "DISPUTABLE":
			return "Open for Disputes";
		case "ARBITRATION":
			return "Arbitration";
		case "CLOSED":
			return "Closed";
	}
};

export const statusToValue = (
	status: "OPEN" | "PICKANSWER" | "DISPUTABLE" | "ARBITRATION" | "CLOSED"
): 0 | 1 | 2 | 3 | 4 => {
	switch (status) {
		case "OPEN":
			return 0;
		case "PICKANSWER":
			return 1;
		case "DISPUTABLE":
			return 2;
		case "ARBITRATION":
			return 3;
		case "CLOSED":
			return 4;
	}
};

export const valueToStatus = (
	value: 0 | 1 | 2 | 3 | 4
): "OPEN" | "PICKANSWER" | "DISPUTABLE" | "ARBITRATION" | "CLOSED" => {
	switch (value) {
		case 0:
			return "OPEN";
		case 1:
			return "PICKANSWER";
		case 2:
			return "DISPUTABLE";
		case 3:
			return "ARBITRATION";
		case 4:
			return "CLOSED";
	}
};

//TODO: types
export const graphQlToJsDate = (minutes) => {
	// Date is in milliseconds
	return new Date(minutes * 60 * 1000);
};

//TODO: types
export const jsToGraphQlDate = (date) => {
	// Date is in milliseconds
	return Math.floor(date / 60000);
};

//TODO: types
export const graphQlToStrDate = (minutes: number) => {
	return graphQlToJsDate(minutes).toLocaleString("en-US", {
		hour: "numeric",
		minute: "numeric",
		month: "long",
		day: "numeric",
	});
};

//TODO: types
export const blobToBase64Str = (blob) => {
	return blob.map((x) => String.fromCharCode(x)).join("");
};
//TODO: types
export const toHHMM = (durationMinutes: number) => {
	if (durationMinutes <= 0) {
		return "00:00";
	}
	let hours = Math.floor(durationMinutes / 60);
	let minutes = Math.floor(durationMinutes - hours * 60);

	var hoursStr = hours.toString();
	if (hours < 10) {
		hoursStr = "0" + hoursStr;
	}
	var minutesStr = minutes.toString();
	if (minutes < 10) {
		minutesStr = "0" + minutesStr;
	}

	return hoursStr + ":" + minutesStr;
};

export const remainderMinToDays = (minutes: number) => {
	return minutes % (60 * 24);
};
