import React from "react";
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import ListWrapper from "../components/core/ListWrapper";
import AnswerWrapper from "../components/question_old/AnswerWrapper";
import QuestionBody from "../components/question_old/QuestionBody";
import SlateSubmit from "../components/question_old/SlateSubmit";
import Loading from "../components/core/Loading";
import QuestionMenu from "../components/question_old/QuestionMenu";
import {
	moStatusToString,
	getFinalWinnerId,
	toFrontendQuestion,
} from "../components/core/utils/conversions";
import {
	calcUserRole,
	user_from_answer_id,
	get_user_from_id,
} from "../components/core/utils/utils";
import { fromNullable } from "@dfinity/utils";
import {
	Answer as IAnswer,
	Question as IQuestion,
	User as IUser,
	Market as IMarketActor,
	FinalWinner as IFinalWinner,
} from "../../declarations/market/market.did";
import { Principal } from "@dfinity/principal";
import PostDate from "../components/core/Date";
import Profile from "../components/core/Profile";
import Content from "../components/question_old/Content";
import Title from "../components/question_old/Title";
import { ActorContext } from "../components/api/Context";
import {
	Status,
	Reward,
	TimeLeft,
	HowMuchTime,
	Divider,
	ShowPayout,
} from "../components/question_old/QuestionMetaData";

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

const Question = () => {
	// --------------------  Context --------------------
	const { user } = useContext(ActorContext);

	// --------------------  URL --------------------
	let { id } = useParams();

	// ------------------------ Question State ------------------------
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

	useEffect(() => {
		let isCancelled = false;
		(async () => {
			const data = await fetch_data();
			if (!isCancelled && data) {
				setState({
					question: toFrontendQuestion(data.question),
					answers: data.answers,
					users: data.users,
				});
			}
		})();

		var interval = setInterval(async () => {
			const data = await fetch_data();
			setLoading(false);
			if (!isCancelled && data) {
				setState({
					question: toFrontendQuestion(data.question),
					answers: data.answers,
					users: data.users,
				});
			}
		}, 5000);
		return () => clearInterval(interval);
	}, []);

	// ------------------------ Status State ------------------------
	const [answerInput, setAnswerInput] = useState<string>("");
	const [currentWinner, setCurrentWinner] = useState<string | undefined>(
		undefined
	);

	// ------------------------ Render ------------------------
	// TODO: this needs to be sensitive towards the role of the user
	// TODO: is not understad fully by the ts compiler
	const userRole = calcUserRole(state.question, state.answers, user.principal);
	if (state.question) {
		const currentCase =
			moStatusToString(state.question.status) + "." + userRole;
		return (
			<>
				<ListWrapper>
					<QuestionMenu
						currentCase={currentCase}
						question_id={state.question.id}
						// TODO:
						currentWinner={currentWinner}
						currentWinningUser={user_from_answer_id(
							currentWinner,
							state.answers,
							state.users
						)}
						potentialWinner={state.question.potentialWinner}
						// TODO:
						potentiallyWinningUser={""}
					/>

					<QuestionBody>
						<div className="max-w-[400px] w-full">
							{/* <QuestionMetaData
								status={state.question.status}
								reward={state.question.reward}
								endDateSec={state.question.status_end_date * 60}
								finalWinner={state.question.finalWinner}
								// TODO: did this have something to do with mobile?
								isTimeShown={true}
								isPayoutShown={true}
							/> */}

							<div className={`flex w-max`}>
								<Status status={state.question.status} />
								<Divider />
								<Reward reward={state.question.reward} />
								<Divider />
								{moStatusToString(state.question.status) === "CLOSED" ? (
									<ShowPayout finalWinner={state.question.finalWinner} />
								) : (
									<TimeLeft status={state.question.status}>
										{moStatusToString(state.question.status) ===
										"ARBITRATION" ? (
											<div>{"1 Day"}</div>
										) : (
											<HowMuchTime
												endDateSec={state.question.status_end_date * 60}
											/>
										)}
									</TimeLeft>
								)}
							</div>
						</div>
						<div className="my-[25px]">
							<Content content={state.question.content} />
							<Title title={state.question.title} />
						</div>
						<div className="flex items-center self-stretch gap-[30px] px-[0px] py-[0px]">
							<Profile
								id={state.question.author_id}
								name={
									get_user_from_id(state.question.author_id, state.users)!.name
								}
							/>
							<PostDate date={Number(state.question.creation_date)} />
						</div>
					</QuestionBody>

					<SlateSubmit
						currentCase={currentCase}
						Input={{
							slateInput: answerInput,
							setSlateInput: setAnswerInput,
							question_id: state.question.id,
						}}
					/>

					<AnswerWrapper
						currentCase={currentCase}
						answers={state.answers}
						users={state.users}
						winner={{
							// TODO: can all either be undefined or defined. Final winner is either the answer id or undefined
							// then there is a perfect match between all of their types
							// so I will unwrap the finalWinningAnswer before passing it I think
							// what if I could directly pass the right one per stage here?
							currentWinner,
							setCurrentWinner: setCurrentWinner,
							potentialWinner: state.question.potentialWinner,
							// TODO:
							finalWinner: getFinalWinnerId(
								state.question.finalWinner,
								state.question.id
							),
						}}
					/>
				</ListWrapper>
			</>
		);
	} else {
		return loading ? (
			<div className="mt-[78px]">
				<Loading />
			</div>
		) : (
			<div className="mt-[78px]">No question found</div>
		);
	}
};

export default Question;
