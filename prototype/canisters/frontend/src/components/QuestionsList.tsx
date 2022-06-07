import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { gql, sudograph } from "sudograph";
import { questionStatusToString, graphQlToJsDate } from "../utils/conversions";

const QuestionsList = ({}: any) => {

	var sudographActor = sudograph({
		canisterId: `${process.env.GRAPHQL_CANISTER_ID}`,
	});

	const [questions, setQuestions] = useState<any>([]);
	const [orderField, setOrderField] = useState<string>("reward");
	const [orderIsAscending, setOrderIsAscending] = useState<boolean>(false);

	const fetchQuestions = async (field: string, isAscending: boolean) => {
		let orderDirective : string = field + ": " + (isAscending ? "ASC" : "DESC");
		const result = await sudographActor.query(gql`
			query {
				readQuestion(order: {` + orderDirective + `}) {
					id
					title
					answers {
						id
					}
					status
					reward
					creation_date
				}
			}
		`);
		setQuestions(result.data.readQuestion);
		setOrderField(field);
		setOrderIsAscending(isAscending);
	}

	const getArrow = (field: string) => {
		return orderField === field ? (orderIsAscending ? "↑" : "↓") : "";
	}

	const getProgressColors = (status) => {
		switch (status) {
			case "OPEN":
				return ["bg-blue-800", "bg-gray-200", "bg-gray-200", "bg-gray-200", "bg-gray-200"]
			case "PICKANSWER":
				return ["bg-green-700", "bg-green-700", "bg-gray-200", "bg-gray-200", "bg-gray-200"]
			case "DISPUTABLE":
				return ["bg-yellow-400", "bg-yellow-400", "bg-yellow-400", "bg-gray-200", "bg-gray-200"]
			case "DISPUTED":
				return ["bg-orange-600", "bg-orange-600", "bg-orange-600", "bg-orange-600", "bg-gray-200"]
			case "CLOSED":
				return ["bg-purple-800", "bg-purple-800", "bg-purple-800", "bg-purple-800", "bg-purple-800"]
		}
	}

	useEffect(() => {
		// not checking for error
		fetchQuestions(orderField, orderIsAscending);
	}, []);

	return (
		<>
			<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
				<div className="p-4">
					<label htmlFor="table-search" className="sr-only">Search</label>
					<div className="relative mt-1">
							<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
									<svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
							</div>
							<input type="text" id="table-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 pl-10 p-2.5  dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for items"/>
					</div>
				</div>
				<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
					<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-200 dark:text-gray-400">
						<tr>
							<th scope="col" className="px-6 py-3">
								Question
							</th>
							<th scope="col" className="px-6 py-3">
								Answers
							</th>
							<th scope="col" className="px-6 py-3">
								<button>Status</button>
							</th>
							<th scope="col" className="px-6 py-3">
								<button onClick={() => {fetchQuestions("reward", !orderIsAscending);}}>Reward { getArrow("reward") }</button>
							</th>
							<th scope="col" className="px-6 py-3">
								<button onClick={() => {fetchQuestions("creation_date", !orderIsAscending);}}>Time left { getArrow("creation_date") }</button>
							</th>
						</tr>
					</thead>
					<tbody>
					{questions.map((question: any) => {
							return (
								<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={question.id}>
									<th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
										<Link to={`/question/${question.id}`}>{question.title}</Link>
									</th>
									<td className="px-6 py-4">
										{question.answers.length}
									</td>
									<td className="px-6 py-4">
									<div className="flex flex-row gap-0.5">
										<div className={`basis-5 h-1.5 ${getProgressColors(question.status)[0]} dark:${getProgressColors(question.status)[0]}`}/>
										<div className={`basis-5 h-1.5 ${getProgressColors(question.status)[1]} dark:${getProgressColors(question.status)[1]}`}/>
										<div className={`basis-5 h-1.5 ${getProgressColors(question.status)[2]} dark:${getProgressColors(question.status)[2]}`}/>
										<div className={`basis-5 h-1.5 ${getProgressColors(question.status)[3]} dark:${getProgressColors(question.status)[3]}`}/>
										<div className={`basis-5 h-1.5 ${getProgressColors(question.status)[4]} dark:${getProgressColors(question.status)[4]}`}/>
									</div>
									</td>
									<td className="px-6 py-4">
										{Math.round(Number(question.reward) * 10000) / 10000} ICP
									</td>
									<td className="px-6 py-4 text-right">
										{graphQlToJsDate(question.creation_date).toLocaleString(
											undefined,
											{
												hour: "numeric",
												minute: "numeric",
												month: "long",
												day: "numeric",
											}
										)}
									</td>
								</tr>
							);
						})
					}
					</tbody>
				</table>
			</div>
		</>
	);
};

export default QuestionsList;
