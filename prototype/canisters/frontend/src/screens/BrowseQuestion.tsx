import ListWrapper from "../components/core/ListWrapper";
import FilterBar from "../components/browseQuestion/FilterBar.jsx";
import QuestionPreview from "../components/browseQuestion/QuestionPreview.jsx";
import Pagination from "../components/browseQuestion/Pagination.jsx";

import { useState, useEffect } from "react";
import avatar from "../components/core/avatar";

// This could be directly imported by the avatars component
import { gql, sudograph } from "sudograph";

const BrowseQuestion = ({ plug }) => {
	/* FETCHING DATA */

	type Status = { value: string; label: string };
	type JSONValue = string | number | boolean | JSONObject | JSONArray;
	interface JSONObject {
		[x: string]: JSONValue;
	}
	interface JSONArray extends Array<JSONValue> {}

	const [questions, setQuestions] = useState<JSONArray>([]);
	const [fetchQuestionsDate, setFetchQuestionsDate] = useState<number>(0);

	const questionsPerPage: number = 10;
	const [orderField, setOrderField] = useState<string>("reward");
	const [orderIsAscending, setOrderIsAscending] = useState<boolean>(false);
	const [searchedText, setSearchedText] = useState<string>("");
	const [pageIndex, setPageIndex] = useState<number>(0);
	const [myInteractions, setMyInteractions] = useState<boolean>(false);

	const [totalQuestions, setTotalQuestions] = useState<number>(0);
	const [statusMap, setStatusMap] = useState<Array<Status>>([
		{ value: "OPEN", label: "Open" },
	]);

	// Fetch the list of questions every 10 seconds if no
	// fetch has been triggered in between
	useEffect(() => {
		const interval = setInterval(() => {
			if (Date.now() - fetchQuestionsDate > 10000) {
				fetchQuestions();
			}
		}, 1000);
		return () => clearInterval(interval);
	}, [fetchQuestionsDate]);

	// Fetch the list of questions every time one of the variables changes
	useEffect(() => {
		fetchQuestions();
	}, [
		orderField,
		orderIsAscending,
		searchedText,
		statusMap,
		pageIndex,
		myInteractions,
	]);

	const fetchQuestions = async () => {
		let sudographActor = sudograph({
			canisterId: `${process.env.GRAPHQL_CANISTER_ID}`,
		});

		var queryInputs: string = "";
		// Add the ordering on a field (ascendant or descendant)
		queryInputs +=
			"order: {" +
			orderField +
			": " +
			(orderIsAscending ? "ASC" : "DESC") +
			"}";
		// Filter the search on key-words (currently hard-coded on question title and content)
		// and selected status
		queryInputs +=
			'search: {and: [{or: [{title: {contains: "' +
			searchedText +
			'"}}, {content: {contains: "' +
			searchedText +
			'"}}]}, {or: [';
		statusMap.map((status: Status, index: number) => {
			if (index != 0) {
				queryInputs += ", ";
			}
			queryInputs += '{status: {eq: "' + status.value + '"}}';
		});
		queryInputs += "]}";
		if (myInteractions) {
			queryInputs += `,{or: [{answers: {author: {id: {eq:"${plug.plug.principalId}"}}}}, {author: {id: {eq: "${plug.plug.principalId}"}}}]}`;
		}
		queryInputs += "]}";

		const allResults = await sudographActor.query(
			gql`
			query {
				readQuestion(` +
				queryInputs +
				`) {
					id
				}
			}
		`
		);

		// Limit the number of questions per page
		queryInputs += "limit: " + questionsPerPage;
		// Offset from page index
		queryInputs += "offset: " + pageIndex * questionsPerPage;

		const pageResults = await sudographActor.query(
			gql`
			query {
				readQuestion(` +
				queryInputs +
				`) {
					id
					author {
						id
						name
					}
					title
					answers {
						id
						author {
							id
						}
					}
					status
					reward
					status_end_date
				}
			}
		`
		);

		setTotalQuestions(allResults.data.readQuestion.length);
		setQuestions(pageResults.data.readQuestion);
		setFetchQuestionsDate(Date.now());
	};

	/* AVATARS */
	const [cachedAvatars, setCachedAvatars] = useState<any>(() => new Map());

	// Load the list of avatars in the cache
	useEffect(() => {
		avatar.loadAvatars(
			questions,
			cachedAvatars,
			setCachedAvatars,
			sudograph,
			gql
		);
	}, [questions]);

	// TO DO:
	// pass avatars to the QuestionPreview component
	// change preview component to use the avatars

	return (
		<>
			<ListWrapper>
				{" "}
				<FilterBar />
				{questions.map((question) => (
					<QuestionPreview question={question} />
				))}
				<QuestionPreview /> <QuestionPreview /> <QuestionPreview />
			</ListWrapper>
			<Pagination />
		</>
	);
};

export default BrowseQuestion;
