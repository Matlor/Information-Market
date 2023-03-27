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
import parse from "html-react-parser";

import { Principal } from "@dfinity/principal";
import { ActorContext } from "../components/api/Context";

// --- new ---
import Loading from "../components/core/Loading";
import { Profile } from "../components/core/Profile";
import Dots from "../components/question/Settings";
import Divider from "../components/question/Divider";
import Solution from "../components/question/Solution";
import Answer from "../components/question/Answer";
import { SelectedTag, WinnerTag, StyledReward } from "../components/core/Tag";
import Reward from "../components/question/Reward";

import { ArrowButton, DefaultButton } from "../components/core/Button";
import Menu from "../components/question/Menu";
import { TimeLeft } from "../components/question/Time";
import Drag from "../components/question/Drag";
import {
	SlateEditor,
	TollbarInstance,
} from "../components/addQuestion/SlateEditor";
import { ArrowIcon, ArrowSmall } from "../components/core/Icons";

import Mail from "../components/core/Mail";

import ConditionToViews from "../components/question/ConditionToViews";
import { defineRole } from "../components/core/utils/utils";

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

// for profile etc. I have to solve the issue of getting the author on the backend
// for pick and dispute: manage ongoing confirmation call to backend
const Question = ({ user, login }) => {
	// --------------------  Context --------------------
	//const { user } = useContext(ActorContext);

	// --------------------  URL --------------------
	let { id } = useParams();

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
			console.log("fetching data");
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

	// ------------------------------------------------ UI ------------------------------------------------
	const [selected, setSelected] = useState(null);
	const [answerInput, setAnswerInput] = useState<string>("");

	if (loading) {
		return (
			<div className="mt-[78px] flex justify-center">
				<Loading />
			</div>
		);
	}

	if (!state?.question) {
		return (
			<div className="mt-[78px] flex justify-center">No question found</div>
		);
	}

	const resolve = {
		getAnswers: {
			solution: "open",
		},
		answer: {
			solution: "open",
			footer: "editor",
		},
		connectToAnswer: {
			solution: "open",
			footer: "login",
		},
		pick: {
			solution: "ongoing",
			tag: (id) => {
				return id === selected && <SelectedTag />;
			},
			answerButton: (id) => {
				return (
					<DefaultButton
						customButton={
							<button className="flex gap-2 items-center">
								<p>Select</p> <ArrowSmall />
							</button>
						}
						propFunction={async () => setSelected(id)}
						text={"select"}
					/>
				);
			},
			footer: "menu",
		},
		dispute: {
			solution: "ongoing",
			tag: (id) => {
				return state.question.potentialWinner === id && <SelectedTag />;
			},
			answerButton: (id) => {
				return (
					state.question?.potentialWinner === id && (
						<div>
							<TimeLeft minutes={state.question.status_end_date} />
							<ArrowButton
								propFunction={async () => {
									console.log(await user.market.dispute(state.question.id));
								}}
								text="dispute"
							/>
						</div>
					)
				);
			},
		},
		ongoing: {
			solution: "ongoing",
		},
		closed: {
			solution: "closed",
			tag: (id) => {
				return (
					state.question.finalWinner === id && (
						<WinnerTag reward={state.question.reward} />
					)
				);
			},
		},
	};

	const role = defineRole(user.principal, state.question, state.answers);
	const viewCase = ConditionToViews(
		role,
		moStatusToString(state.question.status)
	);
	const view = resolve[viewCase];

	console.log("role:", role);
	//console.log("viewCase:", viewCase);
	//console.log("view:", view);

	console.log("state:", state);
	console.log("user:", user);
	return (
		<div className="w-full">
			<div>
				{/* <div className="flex w-full justify-between my-6">
					<Link to="/" className="self-center">
						<ArrowIcon />
					</Link>
					<div className="flex gap-4">
						<Dots />
						{!user.principal ? (
							<div data-cy="login">
								<ArrowButton propFunction={login} text={"Login"} />
							</div>
						) : (
							<Profile
								name={
									(() => {
										return (
											state.users.find(
												(userObj) =>
													userObj.id.toString() === user.principal.toString()
											) ?? { name: "" }
										);
									})().name
								}
								principal={user.principal}
							/>
						)}
					</div>
				</div> */}

				{/* <Divider /> */}
				{/* <Divider /> */}
				<div className="flex justify-between mt-6 mb-4">
					<Profile
						name={"peter"}
						principal={state.question.author_id}
						minutes={state.question.creation_date}
					/>
					<div className="flex gap-7">
						<Solution option={view.solution} />
						<StyledReward reward={state.question.reward} />
					</div>
				</div>

				<div data-cy="title" className="title mb-6 mt-4">
					{state.question.title}
				</div>
				<p data-cy="text" className="text-normal">
					{parse(state.question.content)}
				</p>

				{state.answers.map((answer) => (
					<div className="mt-20" key={answer.id}>
						<Answer
							author_id={answer.author_id}
							content={answer.content}
							tag={view?.tag ? view.tag(answer.id) : null}
							action={view?.answerButton ? view.answerButton(answer.id) : null}
							timeStamp={answer.creation_date}
						/>
					</div>
				))}

				{/* case: editor */}
				<div

				//className="mt-14  w-[1200px]">
				>
					{(() => {
						switch (view.footer) {
							case "login":
								return (
									<Drag>
										<div className="px-6 py-4 flex  justify-center flex-col ">
											{/* <div className="flex h-[6px] w-6 self-center px-8 rounded-md bg-colorText"></div>
											 */}
											<SlateEditor
												inputValue={answerInput}
												setInputValue={setAnswerInput}
												placeholder="Answer..."
											>
												<div className="flex mb-2">
													<div className="flex-1 flex">
														{/* <TollbarInstance /> */}
													</div>
													<div className="flex h-[6px] w-6 self-center px-8 rounded-md bg-colorText"></div>
													<div className="flex flex-1 justify-end">
														<TimeLeft
															minutes={state.question.status_end_date}
														/>
													</div>
												</div>
											</SlateEditor>
										</div>
										{/* CONTINUE HERE */}
										{/* <DefaultButton
											propFunction={async () => {
												await user.market.answer_question(
													state.question.id,
													answerInput
												);
												Mail("new answer");
											}}
											text={"Submit"}
										/> */}
									</Drag>
								);
							case "login":
								return (
									<div data-cy="login">
										<DefaultButton propFunction={login} text="Login" />
									</div>
								);
							case "menu":
								return (
									<Menu
										selected={selected}
										confirmFunc={async () => {
											console.log("selected:", selected);
											console.log(
												await user.market.pick_answer(
													state.question.id,
													selected
												)
											);
										}}
									/>
								);
							default:
								return <></>;
						}
					})()}
				</div>
			</div>
		</div>
	);
};

export default Question;
