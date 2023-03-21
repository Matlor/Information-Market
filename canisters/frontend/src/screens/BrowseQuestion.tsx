import React, { useState, useEffect, useReducer, useContext } from "react";
import ListWrapper from "../components/app/ListWrapper";
import Search from "../components/browseQuestion/Search";
import Pagination from "../components/browseQuestion/Pagination";
import Loading from "../components/core/Loading";
import { Question as IQuestion } from "../../declarations/market/market.did.d";
import { Principal } from "@dfinity/principal";
import { toNullable } from "@dfinity/utils";
import { ActorContext } from "../components/api/Context";

import { Link } from "react-router-dom";
import Profile from "../components/core/Profile";
import { AnswersIcon, OnIcon } from "../components/core/Icons";
import NumAnswers from "../components/browseQuestion/NumAnswers";
import { moStatusToString } from "../components/core/utils/conversions";
import { TimeLeft } from "../components/question/Time";

import Filter from "../components/browseQuestion/Filter";

import { e8sToIcp } from "../components/core/utils/conversions";

// ---------- Types ----------
export interface IStatusMap {
	open: boolean;
	pickanswer: boolean;
	disputable: boolean;
	arbitration: boolean;
	payout: boolean;
	closed: boolean;
}
export type MyInteractions = Principal | undefined;

export type OrderBy = "REWARD" | "TIME_LEFT";
export type OrderDirection = "ASCD" | "DESCD";
type Order = {
	orderBy: OrderBy;
	orderDirection: OrderDirection;
};

interface IConditions {
	status: IStatusMap;
	searchedText: string;
	myInteractions: MyInteractions;
	order: Order;
	pagination: {
		pageIndex: number;
		questionsPerPage: number;
	};
}

interface IAction {
	type: string;
	[key: string]: any;
}

interface IQuestionsData {
	questions: { question: IQuestion }[];
	totalQuestions: number;
}

const BrowseQuestion = () => {
	// --------------------  Context --------------------
	const { user } = useContext(ActorContext);

	// --------------------  Conditions --------------------
	const [loading, setLoading] = useState({
		main: true,
		search: false,
		filter: false,
	});

	const conditionsReducer = (
		state: IConditions,
		action: IAction
	): IConditions => {
		switch (action.type) {
			case "updateSearchedText":
				setLoading({ main: false, search: true, filter: false });
				return {
					...state,
					searchedText: action.searchedText,
				};
			case "updateMyInteractions":
				setLoading({ main: false, search: false, filter: true });
				return {
					...state,
					myInteractions: action.field,
				};

			case "toggleStatus":
				return {
					...state,
					status: {
						...state.status,
						open: true,
						pickanswer: !state.status.pickanswer,
						disputable: !state.status.disputable,
						arbitration: !state.status.arbitration,
						payout: !state.status.payout,
						closed: !state.status.closed,
					},
				};

			case "updateOrder":
				if (
					action.field.orderBy != "TIME_LEFT" &&
					action.field.orderBy != "REWARD" &&
					action.field.orderDirection != "ASCD" &&
					action.field.orderDirection != "DESCD"
				) {
					return state;
				}

				setLoading({ main: true, search: false, filter: false });
				return {
					...state,
					order: {
						orderBy: action.field.orderBy,
						orderDirection: action.field.orderDirection,
					},
				};

			case "updatePageIndex":
				setLoading({ main: true, search: false, filter: false });
				return {
					...state,
					pagination: {
						...state.pagination,
						pageIndex: action.field,
					},
				};
			default:
				return state;
		}
	};

	const [conditions, dispatch] = useReducer(conditionsReducer, {
		status: {
			open: true,
			pickanswer: true,
			disputable: true,
			arbitration: true,
			payout: true,
			closed: true,
		},
		searchedText: "",
		myInteractions: undefined,
		order: {
			orderBy: "REWARD",
			orderDirection: "ASCD",
		},
		pagination: {
			pageIndex: 0,
			questionsPerPage: 4,
		},
	});

	// --------------------  Data --------------------
	const [questionData, setQuestionData] = useState<IQuestionsData>({
		questions: [],
		totalQuestions: 0,
	});

	async function fetch_data() {
		return await user.market.get_conditional_questions_with_authors(
			conditions.status,
			conditions.searchedText,
			toNullable(conditions.myInteractions),
			{
				[conditions.order.orderBy]: {
					[conditions.order.orderDirection]: null,
				},
			},
			conditions.pagination.pageIndex * conditions.pagination.questionsPerPage,
			conditions.pagination.questionsPerPage
		);
	}

	useEffect(() => {
		let isCancelled = false;

		(async () => {
			const response = await fetch_data();
			const { data, num_questions } = response;
			if (!isCancelled) {
				setQuestionData({
					questions: data,
					totalQuestions: num_questions,
				});
				setLoading({ main: false, search: false, filter: false });
			}
		})();
		var interval = setInterval(async () => {
			const response = await fetch_data();
			const { data, num_questions } = response;
			if (!isCancelled) {
				setQuestionData({
					questions: data,
					totalQuestions: num_questions,
				});
				setLoading({ main: false, search: false, filter: false });
			}
		}, 5000);
		return () => {
			isCancelled = true;
			clearInterval(interval);
		};
	}, [conditions]);

	// --------------------  Handlers --------------------
	const toOrderAndPossiblyToggle = (orderBy: OrderBy) => {
		const direction = () => {
			if (conditions.order.orderBy == orderBy) {
				return conditions.order.orderDirection == "ASCD" ? "DESCD" : "ASCD";
			} else {
				return conditions.order.orderDirection;
			}
		};
		dispatch({
			type: "updateOrder",
			field: {
				orderBy,
				orderDirection: direction(),
			},
		});
	};
	const setSearchedText = (text) => {
		dispatch({
			type: "updateSearchedText",
			searchedText: text,
		});
	};

	const toggleStatus = () => {
		console.log("toggleStatus");
		dispatch({ type: "toggleStatus" });
	};

	const toggleMyInteractions = (principal) => {
		dispatch({
			type: "updateMyInteractions",
			field: conditions.myInteractions == undefined ? principal : undefined,
		});
	};
	const setSortOrder = (orderBy) => toOrderAndPossiblyToggle(orderBy);
	const setPageIndex = (pageIndex: number) => {
		dispatch({ type: "updatePageIndex", field: pageIndex });
	};

	const ViewState = ({ children }) => {
		if (loading.main) {
			return (
				<div className="w-full h-40 items-center flex justify-center">
					<Loading />
				</div>
			);
		} else if (questionData.totalQuestions === 0) {
			return (
				<div className="w-full h-40 items-center flex justify-center text-normal">
					No Questions
				</div>
			);
		} else {
			return <div>{children}</div>;
		}
	};

	console.log(questionData.questions, "questions");

	return (
		<>
			<ListWrapper>
				<div className="flex justify-between mb-10">
					<Search
						searchLoading={loading.search}
						setSearchedText={setSearchedText}
					/>
					<Filter
						checks={{
							status: conditions.status,
							toggleStatus,
							myInteractions: conditions.myInteractions,
							toggleMyInteractions,
						}}
						isLoading={loading.filter}
						setSortOrder={setSortOrder}
						order={conditions.order}
					/>
				</div>

				<ViewState>
					<div className="flex flex-col gap-20">
						{questionData.questions.map((questionAndAuthor: any, index) => {
							const { question, author } = questionAndAuthor;
							return (
								<div key={question.id}>
									<Link
										to={`/question/${question.id}`}
										className="flex flex-col gap-3"
									>
										<div className="flex justify-between items-center">
											<div className="flex gap-10">
												<Profile
													id={author.id}
													name={author.name}
													timeStamp={question.creation_date}
												/>
												<NumAnswers number={question.answers.length} />
											</div>
											<div className="flex gap-4 items-center">
												{moStatusToString(question.status) === "OPEN" && (
													<div className="flex gap-1 items-center justify-center px-3 py-1 rounded-sm">
														<TimeLeft
															minutes={question.status_end_date}
															icon={false}
														/>
														<OnIcon />
													</div>
												)}
												{moStatusToString(question.status)}
												<div className="flex items-center justify-center px-3 py-1 bg-colorBackgroundComponents rounded-sm whitespace-nowrap self-stretch w-full overflow-hidden">
													{e8sToIcp(question.reward)} ICP
												</div>
											</div>
										</div>
										<div className="text-normal">
											{question.title.charAt(0).toUpperCase() +
												question.title.slice(1)}
										</div>
									</Link>
								</div>
							);
						})}
					</div>
				</ViewState>
			</ListWrapper>
			<div className="flex justify-center mt-20">
				<Pagination
					pagination={{
						pageIndex: conditions.pagination.pageIndex,
						questionsPerPage: conditions.pagination.questionsPerPage,
					}}
					totalQuestions={questionData.totalQuestions}
					setPageIndex={setPageIndex}
				/>
			</div>
		</>
	);
};

export default BrowseQuestion;

{
	/* QUESTION LIST */
}
{
	/* {loading.main ? (
					<div className="w-full h-40 items-center flex justify-center">
						<Loading />
					</div>
				) : questionData.totalQuestions === 0 ? (
					<div className="w-full h-40 items-center flex justify-center text-normal">
						No Questions
					</div>
				) : ( */
}

{
	/* 	)} */
}

{
	/* QUESTION MENU */
}
{
	/* div className="flex flex-col sm:flex-row sm:justify-between gap-normal">
					<div className="sm:w-1/2">
						<Search
							searchLoading={loading.search}
							setSearchedText={setSearchedText}
						/>
					</div>
					<div className="sm:w-1/2 flex justify-between items-center p-0 gap-[17px] sm:justify-end">
						<Filter
							checks={{
								status: conditions.status,
								setStatus,
								myInteractions: conditions.myInteractions,
								toggleMyInteractions,
							}}
							isLoading={loading.filter}
						/>
						<Sort setSortOrder={setSortOrder} order={conditions.order} />
					</div>
				</div> */
}

{
	/* <div className="flex gap-1 items-center">
													<div className="scale-125 mt-[2px]">
														<AnswersIcon />
													</div>
													<div className="text-small-number">
														{question.answers.length}
													</div>
												</div> */
}
