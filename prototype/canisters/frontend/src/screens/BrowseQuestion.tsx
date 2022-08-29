import ListWrapper from "../components/core/view/ListWrapper";
import FilterBar from "../components/browseQuestion/view/FilterBar.jsx";
import QuestionPreview from "../components/browseQuestion/view/QuestionPreview.js";
import Pagination from "../components/browseQuestion/view/Pagination.js";

import { useState, useEffect } from "react";
import getQuestions from "../components/browseQuestion/services/getQuestions";
import avatar from "../components/core/services/avatar";
import { conditionalDelay } from "@dfinity/agent/lib/cjs/polling/strategy";

const BrowseQuestion = ({ plug }) => {
	/* FETCHING DATA */
	type Status = { value: string; label: string };
	type JSONValue = string | number | boolean | JSONObject | JSONArray;
	interface JSONObject {
		[x: string]: JSONValue;
	}
	interface JSONArray extends Array<JSONValue> {}

	const questionsPerPage: number = 10;
	const [orderField, setOrderField] = useState<string>("reward");
	const [orderIsAscending, setOrderIsAscending] = useState<boolean>(false);
	const [searchedText, setSearchedText] = useState<string>("");
	const [pageIndex, setPageIndex] = useState<number>(0);
	const [myInteractions, setMyInteractions] = useState<boolean>(false);
	const [statusMap, setStatusMap] = useState<Array<Status>>([
		{ value: "OPEN", label: "Open" },
		{ value: "PICKANSWER", label: "Winner Selection" },
		{ value: "DISPUTABLE", label: "Open for disputes" },
		{ value: "DISPUTED", label: "Arbitration" },
		{ value: "CLOSED", label: "Closed" },
	]);

	const [fetchQuestionsDate, setFetchQuestionsDate] = useState<number>(0);
	const [questions, setQuestions] = useState<JSONArray>([]);
	const [totalQuestions, setTotalQuestions] = useState<number>(0);

	/* FETCHING QUESTIONS */
	// Fetch the list of questions every 10 seconds if no
	// fetch has been triggered in between
	useEffect(() => {
		const interval = setInterval(async () => {
			if (Date.now() - fetchQuestionsDate > 10000) {
				const result = await getQuestions(
					orderField,
					orderIsAscending,
					searchedText,
					statusMap,
					myInteractions,
					plug,
					questionsPerPage,
					pageIndex
				);

				setFetchQuestionsDate(result.timestamp);
				setTotalQuestions(result.totalQuestions);
				setQuestions(result.questions);
			}
		}, 1000);
		return () => clearInterval(interval);
	}, [fetchQuestionsDate]);

	// Fetch the list of questions every time one of the variables changes
	useEffect(() => {
		(async () => {
			const result = await getQuestions(
				orderField,
				orderIsAscending,
				searchedText,
				statusMap,
				myInteractions,
				plug,
				questionsPerPage,
				pageIndex
			);
			setFetchQuestionsDate(result.timestamp);
			setTotalQuestions(result.totalQuestions);
			setQuestions(result.questions);
		})();
	}, [
		orderField,
		orderIsAscending,
		searchedText,
		statusMap,
		pageIndex,
		myInteractions,
	]);

	/* FETCHING AVATARS */
	const [cachedAvatars, setCachedAvatars] = useState<any>(() => new Map());

	// Load the list of avatars in the cache
	useEffect(() => {
		const loadAvatars = async function (
			questions: any,
			cachedAvatars,
			setCachedAvatars
		) {
			try {
				for (var i = 0; i < questions.length; i++) {
					let question: any = questions[i];
					if (!cachedAvatars.has(question.author.id)) {
						const loadedAvatar = await avatar.loadAvatar(question.author.id);
						setCachedAvatars(
							(prev) => new Map([...prev, [question.author.id, loadedAvatar]])
						);
					}
					for (var j = 0; j < question.answers.length; j++) {
						let answer: any = question.answers[j];
						if (!cachedAvatars.has(answer.author.id)) {
							const loadedAvatar = await avatar.loadAvatar(answer.author.id);
							setCachedAvatars(
								(prev) => new Map([...prev, [answer.author.id, loadedAvatar]])
							);
						}
					}
				}
			} catch (error) {
				console.error("Failed to load avatars!");
			}
		};
		loadAvatars(questions, cachedAvatars, setCachedAvatars);
	}, [questions]);

	// TO DO:
	// pass avatars to the QuestionPreview component
	// change preview component to use the avatars

	return (
		<>
			<ListWrapper>
				{" "}
				<FilterBar
					setSearchedText={setSearchedText}
					statusMap={statusMap}
					setStatusMap={setStatusMap}
					setOrderIsAscending={setOrderIsAscending}
					setOrderField={setOrderField}
				/>
				{questions.map((question, index) => (
					<QuestionPreview question={question} key={index} />
				))}
			</ListWrapper>
			<Pagination
				pageIndex={pageIndex}
				setPageIndex={setPageIndex}
				totalQuestions={totalQuestions}
				questionsPerPage={questionsPerPage}
			/>
		</>
	);
};

export default BrowseQuestion;
