import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

// --- old ---
import {
	toFrontendQuestion,
	moStatusToString,
} from "../components/core/utils/conversions";
import { fromNullable } from "@dfinity/utils";
import {
	Answer as IAnswer,
	Question as IQuestion,
	User as IUser,
	Market as IMarketActor,
	FinalWinner as IFinalWinner,
} from "../../declarations/market/market.did";

import ConditionToViews from "../components/question/ConditionToViews";

import { Principal } from "@dfinity/principal";
import { ActorContext } from "../components/api/Context";

import { defineRole } from "../components/core/utils/utils";

// --- new ---
import Loading from "../components/core/Loading";
import UIQuestion from "../components/question/UIQuestion";
import {
	ICurrentUser,
	ILoggedInUser,
	ILoggedOutUser,
	LoginFunction,
} from "./App";

// ---------- Types ----------
type Modify<T, K> = Pick<T, Exclude<keyof T, keyof K>> & K;

export interface FQuestion
	extends Modify<
		IQuestion,
		{
			close_transaction_block_height: undefined | bigint;
			potentialWinner: undefined | string;
			finalWinner: undefined | IFinalWinner;
		}
	> {}

interface IState {
	question: FQuestion | undefined;
	answers: IAnswer[];
	users: IUser[];
}

interface IProps {
	user: ICurrentUser;
}

// for profile etc. I have to solve the issue of getting the author on the backend
// for pick and dispute: manage ongoing confirmation call to backend
const Question = ({ user }: IProps) => {
	// --------------------  Context --------------------
	//const { user } = useContext(ActorContext);

	//const role = defineRole(user.principal);

	// --------------------  URL --------------------
	let params = useParams();
	let id = Number(params);

	// ------------------------ Question State ------------------------
	// TODO: PUT ALL OF THIS UP UNTIL UI IN A PARENT COMPONENT OR IN A HOOK
	// TODO: combine with loading
	const [state, setState] = useState<IState>({
		question: undefined,
		answers: [],
		users: [],
	});
	const [loading, setLoading] = useState<boolean>(true);

	const fetch_data = async () => {
		if (!id) {
			console.debug("id is undefined or null");
			return undefined;
		}
		try {
			return fromNullable(await user.market.get_question_data(id));
		} catch (err) {
			console.debug(err);
			return undefined;
		}
	};

	const fetchDataAndUpdateState = async () => {
		const data = await fetch_data();
		setLoading(false);
		if (data) {
			setState({
				question: toFrontendQuestion(data.question),
				answers: data.answers,
				users: data.users,
			});
		}
	};

	useEffect(() => {
		let isCancelled = false;

		// Fetch data and update state immediately
		if (!isCancelled) {
			fetchDataAndUpdateState();
		}

		// Set interval to fetch data regularly
		const interval = setInterval(async () => {
			if (!isCancelled) {
				fetchDataAndUpdateState();
			}
		}, 5000);

		// Cleanup function to clear interval
		return () => {
			isCancelled = true;
			clearInterval(interval);
		};
	}, []);

	console.log("state", state.question);

	// ------------------------------------------------ UI ------------------------------------------------
	const [selected, setSelected] = useState<number | null>(null);
	const [answerInput, setAnswerInput] = useState<string>("");

	// TODO: Destructuring of question and answers should happen here and then they should be passed to the components

	if (loading) {
		return (
			<div className="mt-[78px] flex justify-center">
				<Loading />
			</div>
		);
	}

	if (!state?.question) {
		return (
			<div className="mt-[78px] flex justify-center text-large">
				No question found
			</div>
		);
	} else {
		const question = state.question;
		const answers = state.answers;
		const users = state.users;

		const role = defineRole(user.principal, question, answers);
		const viewCase = ConditionToViews(role, moStatusToString(question.status));

		return (
			<UIQuestion
				question={question}
				answers={answers}
				users={users}
				answer={{ answerInput, setAnswerInput }}
				select={{ selected, setSelected }}
				viewCase={viewCase}
				user={user}
			/>
		);
	}
};

export default Question;
