import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { gql, sudograph } from "sudograph";
import StatusSelection from "./StatusSelection";
import { e3sToIcp, jsToGraphQlDate, toHHMM } from "../utils/conversions";
import { Navigate } from "react-router-dom";

type Status = { value: string; label: string };

type JSONValue = string | number | boolean | JSONObject | JSONArray;

interface JSONObject {
	[x: string]: JSONValue;
}

interface JSONArray extends Array<JSONValue> {}

const QuestionsList = ({ title, requireAuthentication, plug }: any) => {
	if (requireAuthentication) {
		if (!plug.isConnected) {
			return <Navigate to="/" replace />;
		}
	}

	const questionsPerPage: number = 10;
	const [questions, setQuestions] = useState<JSONArray>([]);
	const [orderField, setOrderField] = useState<string>("reward");
	const [orderIsAscending, setOrderIsAscending] = useState<boolean>(false);
	const [searchedText, setSearchedText] = useState<string>("");
	const [pageIndex, setPageIndex] = useState<number>(0);
	const [totalQuestions, setTotalQuestions] = useState<number>(0);
	const [statusMap, setStatusMap] = useState<Array<Status>>([
		{ value: "OPEN", label: "Open" },
	]);
	const [fetchQuestionsDate, setFetchQuestionsDate] = useState<number>(0);

	useEffect(() => {
		const interval = setInterval(() => {
			// Update the list of questions every 10 seconds if no interactions has triggered
			// the update in between
			if (Date.now() - fetchQuestionsDate > 10000) {
				fetchQuestions();
			}
		}, 1000);

		fetchQuestions();

		return () => clearInterval(interval);
	}, [orderField, orderIsAscending, searchedText, statusMap, pageIndex]);

	const refreshSearchedText = (event) => {
		setSearchedText(event.target.value);
		setPageIndex(0);
	};

	const refreshStatusMap = (map) => {
		// At least one status has to be selected
		if (map.length != 0) {
			setStatusMap(map);
			setPageIndex(0);
		}
	};

	const fetchQuestions = async () => {
		setFetchQuestionsDate(Date.now());

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
		queryInputs += "]}]}";

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

		setTotalQuestions(allResults.data.readQuestion.length);

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
					title
					answers {
						id
					}
					status
					reward
					status_end_date
				}
			}
		`
		);

		setQuestions(pageResults.data.readQuestion);
	};

	const getArrow = (field: string) => {
		return orderField === field ? (orderIsAscending ? "↑" : "↓") : "";
	};

	const getProgressColors = (status) => {
		switch (status) {
			case "OPEN":
				return [
					"bg-blue-800",
					"bg-gray-200",
					"bg-gray-200",
					"bg-gray-200",
					"bg-gray-200",
				];
			case "PICKANSWER":
				return [
					"bg-green-700",
					"bg-green-700",
					"bg-gray-200",
					"bg-gray-200",
					"bg-gray-200",
				];
			case "DISPUTABLE":
				return [
					"bg-yellow-400",
					"bg-yellow-400",
					"bg-yellow-400",
					"bg-gray-200",
					"bg-gray-200",
				];
			case "DISPUTED":
				return [
					"bg-orange-600",
					"bg-orange-600",
					"bg-orange-600",
					"bg-orange-600",
					"bg-gray-200",
				];
			case "CLOSED":
				return [
					"bg-purple-800",
					"bg-purple-800",
					"bg-purple-800",
					"bg-purple-800",
					"bg-purple-800",
				];
		}
	};

	return (
		<>
			<h1 className="page-title"> {title} </h1>
			<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
				<label
					htmlFor="default-search"
					className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
				>
					Search questions
				</label>
				<div className="relative">
					<div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
						<svg
							className="w-5 h-5 text-gray-500 dark:text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							></path>
						</svg>
					</div>
					<input
						type="text"
						value={searchedText}
						onChange={refreshSearchedText}
						className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						placeholder="Search questions..."
						required
					/>
				</div>
				<StatusSelection onChange={refreshStatusMap} statusMap={statusMap} />
				<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
					<thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-200 dark:text-gray-400">
						<tr>
							<th scope="col" className="px-6 py-3">
								Question
							</th>
							<th scope="col" className="px-6 py-3">
								Answers
							</th>
							<th scope="col" className="px-6 py-3">
								Status
							</th>
							<th scope="col" className="px-6 py-3">
								<button
									onClick={() => {
										setOrderField("reward");
										setOrderIsAscending(!orderIsAscending);
									}}
								>
									Reward {getArrow("reward")}
								</button>
							</th>
							<th scope="col" className="px-6 py-3">
								<button
									onClick={() => {
										setOrderField("status_end_date");
										setOrderIsAscending(!orderIsAscending);
									}}
								>
									Time left {getArrow("status_end_date")}
								</button>
							</th>
						</tr>
					</thead>
					<tbody>
						{questions.map((question: any) => {
							return (
								<tr
									className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
									key={question.id}
								>
									<th
										scope="row"
										className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
									>
										<Link to={`/question/${question.id}`}>
											{question.title}
										</Link>
									</th>
									<td className="px-6 py-4">{question.answers.length}</td>
									<td className="px-6 py-4">
										<div className="flex flex-row gap-0.5">
											<div
												className={`basis-5 h-1.5 ${
													getProgressColors(question.status)[0]
												} dark:${getProgressColors(question.status)[0]}`}
											/>
											<div
												className={`basis-5 h-1.5 ${
													getProgressColors(question.status)[1]
												} dark:${getProgressColors(question.status)[1]}`}
											/>
											<div
												className={`basis-5 h-1.5 ${
													getProgressColors(question.status)[2]
												} dark:${getProgressColors(question.status)[2]}`}
											/>
											<div
												className={`basis-5 h-1.5 ${
													getProgressColors(question.status)[3]
												} dark:${getProgressColors(question.status)[3]}`}
											/>
											<div
												className={`basis-5 h-1.5 ${
													getProgressColors(question.status)[4]
												} dark:${getProgressColors(question.status)[4]}`}
											/>
										</div>
									</td>
									<td className="px-6 py-4">
										{e3sToIcp(Number(question.reward))} ICP
									</td>
									<td className="px-6 py-4 text-right">
										{toHHMM(
											question.status_end_date - jsToGraphQlDate(Date.now())
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
				<div className="flex flex-col items-center">
					<span className="text-sm text-gray-700 dark:text-gray-400">
						Showing{" "}
						<span className="font-semibold text-gray-900 dark:text-white">
							{totalQuestions == 0 ? 0 : pageIndex * questionsPerPage + 1}
						</span>{" "}
						to{" "}
						<span className="font-semibold text-gray-900 dark:text-white">
							{Math.min((pageIndex + 1) * questionsPerPage, totalQuestions)}
						</span>{" "}
						of{" "}
						<span className="font-semibold text-gray-900 dark:text-white">
							{totalQuestions}
						</span>{" "}
						Entries
					</span>
					<div className="inline-flex mt-2 xs:mt-0">
						<button
							disabled={pageIndex < 1}
							onClick={() => {
								setPageIndex(pageIndex - 1);
							}}
							className="inline-flex items-center py-2 px-4 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
						>
							<svg
								className="mr-2 w-5 h-5"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fillRule="evenodd"
									d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
									clipRule="evenodd"
								></path>
							</svg>
							Prev
						</button>
						<button
							disabled={(pageIndex + 1) * questionsPerPage >= totalQuestions}
							onClick={() => {
								setPageIndex(pageIndex + 1);
							}}
							className="inline-flex items-center py-2 px-4 text-sm font-medium text-white bg-gray-800 rounded-r border-0 border-l border-gray-700 hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
						>
							Next
							<svg
								className="ml-2 w-5 h-5"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fillRule="evenodd"
									d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
									clipRule="evenodd"
								></path>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default QuestionsList;
