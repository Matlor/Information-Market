import ListWrapper from "../components/core/view/ListWrapper";
import FilterBar from "../components/browseQuestion/view/FilterBar";
import QuestionPreview from "../components/browseQuestion/view/QuestionPreview";
import Pagination from "../components/browseQuestion/view/Pagination";

import { useState, useEffect } from "react";
import getQuestions from "../components/browseQuestion/services/getQuestions";

import sudograph from "../components/core/services/sudograph";
import { blobToBase64Str } from "../components/core/services/utils/conversions";
import Loading from "../components/core/view/Loading";

const BrowseQuestion = ({ userPrincipal, isConnected }: any) => {
	type Status = { value: string; label: string };
	type JSONValue = string | number | boolean | JSONObject | JSONArray;
	interface JSONObject {
		[x: string]: JSONValue;
	}
	interface JSONArray extends Array<JSONValue> {}

	// TODO: This could potentially be 1 object
	const questionsPerPage: number = 10;

	const [searchedText, setSearchedText] = useState<string>("");
	const [myInteractions, setMyInteractions] = useState<boolean>(false);
	const [statusMap, setStatusMap] = useState<Array<Status>>([
		{ value: "OPEN", label: "Open" },
		{ value: "PICKANSWER", label: "Winner Selection" },
		{ value: "DISPUTABLE", label: "Open for disputes" },
		{ value: "DISPUTED", label: "Arbitration" },
		{ value: "CLOSED", label: "Closed" },
	]);
	const [orderField, setOrderField] = useState<string>("reward");
	const [orderIsAscending, setOrderIsAscending] = useState<boolean>(false);

	const [pageIndex, setPageIndex] = useState<number>(0);

	const [fetchQuestionsDate, setFetchQuestionsDate] = useState<number>(0);

	const [questions, setQuestions] = useState<JSONArray>([]);
	const [totalQuestions, setTotalQuestions] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [filterLoading, setFilterLoading] = useState<boolean>(false);
	const [searchLoading, setSearchLoading] = useState<boolean>(false);

	const [cachedAvatars, setCachedAvatars] = useState<any>(() => new Map());

	const loadAvatars = async (questions: any, cachedAvatars) => {
		try {
			for (var i = 0; i < questions.length; i++) {
				let question: any = questions[i];
				if (!cachedAvatars.has(question.author.id)) {
					const res = await sudograph.query_avatar(question.author.id);
					const loadedAvatar = await blobToBase64Str(
						res.data.readUser[0].avatar
					);
					setCachedAvatars(
						(prev: any) =>
							new Map([...prev, [question.author.id, loadedAvatar]])
					);
				}
			}
		} catch (error) {
			console.error("Failed to load avatars!");
		}
	};

	const fetch_data = async () => {
		const result = await getQuestions(
			orderField,
			orderIsAscending,
			searchedText,
			statusMap,
			myInteractions,
			userPrincipal,
			questionsPerPage,
			pageIndex
		);
		return result;
	};

	const set_data = async (result) => {
		await loadAvatars(result.questions, cachedAvatars);
		setFetchQuestionsDate(result.timestamp);
		setTotalQuestions(result.totalQuestions);
		setQuestions(result.questions);
	};

	useEffect(() => {
		let isCancelled = false;

		const get_data = async () => {
			setSearchLoading(true);

			let result = await fetch_data();
			if (!isCancelled) {
				await set_data(result);
				setSearchLoading(false);
			}
		};
		if (totalQuestions !== null) {
			get_data();
		}

		return () => {
			isCancelled = true;
		};
	}, [searchedText]);

	useEffect(() => {
		let isCancelled = false;

		const get_data = async () => {
			setFilterLoading(true);

			let result = await fetch_data();

			if (!isCancelled) {
				await set_data(result);
				setFilterLoading(false);
			}
		};
		if (totalQuestions !== null) {
			get_data();
		}

		return () => {
			isCancelled = true;
		};
	}, [statusMap]);

	useEffect(() => {
		let isCancelled = false;

		const get_data = async () => {
			setLoading(true);
			let result = await fetch_data();
			if (!isCancelled) {
				await set_data(result);
				setLoading(false);
			}
		};
		get_data();

		return () => {
			isCancelled = true;
		};
	}, [pageIndex, orderField, orderIsAscending, myInteractions]);

	useEffect(() => {
		var interval = setInterval(async () => {
			if (Date.now() - fetchQuestionsDate > 10000) {
				await set_data(await fetch_data());
			}
		}, 5000);
		return () => clearInterval(interval);
	}, [fetchQuestionsDate]);

	return (
		<>
			<ListWrapper>
				{" "}
				<FilterBar
					setSearchedText={setSearchedText}
					statusMap={statusMap}
					setStatusMap={setStatusMap}
					orderIsAscending={orderIsAscending}
					setOrderIsAscending={setOrderIsAscending}
					setOrderField={setOrderField}
					myInteractions={myInteractions}
					setMyInteractions={setMyInteractions}
					isConnected={isConnected}
					filterLoading={filterLoading}
					setFilterLoading={setFilterLoading}
					searchLoading={searchLoading}
				/>
				{loading ? (
					<div className="w-full h-40 items-center flex justify-center">
						<Loading />
					</div>
				) : totalQuestions === 0 ? (
					<div className="w-full h-40 items-center flex justify-center heading3">
						No Questions
					</div>
				) : (
					<>
						{questions.map((question: any, index) => (
							<QuestionPreview
								reward={question.reward}
								status={question.status}
								id={question.id}
								title={question.title}
								authorName={question.author.name}
								numAnswers={question.answers.length}
								date={question.date}
								avatar={cachedAvatars.get(question.author.id)}
								key={index}
							/>
						))}
					</>
				)}
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
