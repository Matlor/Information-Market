import { Link } from "react-router-dom";
import { gql, sudograph } from "sudograph";
import { e3sToIcp, graphQlToJsDate } from "../utils/conversions";
import { default as ReactSelect } from "react-select";
import { components } from "react-select";
import React from 'react'

const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};

const allStatus : StatusMap = [
  { value: "OPEN", label: "Open"},
  { value: "PICKANSWER", label: "Winner Selection"},
  { value: "DISPUTABLE", label: "Open for disputes"},
  { value: "DISPUTED", label: "Arbitration"},
  { value: "CLOSED", label: "Closed"}
];

type Status = {value: string, label:string};
type StatusMap = Array<Status>;

type JSONValue =
    | string
    | number
    | boolean
    | JSONObject
    | JSONArray;

	interface JSONObject {
		[x: string]: JSONValue;
}

interface JSONArray extends Array<JSONValue> { }

type QuestionListState = {
	questions: JSONArray,
	orderField: string,
	orderIsAscending: boolean,
	searchedText: string,
	questionsPerPage: number,
	pageIndex: number,
	totalQuestions: number,
	statusMap: StatusMap
};

export default class QuestionsList extends React.Component<{}, QuestionListState> {

	constructor(props) {
    super(props);
    this.state = {
			questions: [],
			orderField: 'reward',
			orderIsAscending: false,
			searchedText: '',
			questionsPerPage: 10,
			pageIndex: 0,
			totalQuestions: 0,
			statusMap: [{ value: "OPEN", label: "Open"}]
		};
    this.setSearchedText = this.setSearchedText.bind(this);
		this.setStatusMap = this.setStatusMap.bind(this);
		this.fetchQuestions = this.fetchQuestions.bind(this);
		this.getArrow = this.getArrow.bind(this);
		this.getProgressColors = this.getProgressColors.bind(this);
  }

	setOrderField(field) {
		if (this.state.orderField != field){
			this.setState({orderField: field});
		}
	}

	setOrderIsAscending(isAscending) {
		if (this.state.orderIsAscending != isAscending){
			this.setState({orderIsAscending: isAscending});
		}
	}

	setSearchedText(event) {
		this.setState({searchedText: event.target.value, pageIndex:0});
	}

	setStatusMap(map) {
		if (map.length != 0){
			this.setState({statusMap: map, pageIndex:0});
		}
	}

	setPageIndex(index) {
		if(this.state.pageIndex != index){
			this.setState({pageIndex: index});
		}
	}

	componentDidMount(): void {
		this.fetchQuestions();
	};

	componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<QuestionListState>, snapshot?: any): void {
		if (this.state.orderField != prevState.orderField ||
			this.state.orderIsAscending != prevState.orderIsAscending ||
			this.state.searchedText != prevState.searchedText ||
			this.state.statusMap != prevState.statusMap ||
			this.state.pageIndex != prevState.pageIndex){
			this.fetchQuestions();
		}
	}

	fetchQuestions = async () => {
		let sudographActor = sudograph({canisterId: `${process.env.GRAPHQL_CANISTER_ID}`});

		var queryInputs : string = "";
		// Add the ordering on a field (ascendant or descendant)
		queryInputs += "order: {" + this.state.orderField + ": " + (this.state.orderIsAscending ? "ASC" : "DESC") + "}";
		// Filter the search on key-words (currently hard-coded on question title and content)
		// and selected status
		queryInputs += "search: {and: [{or: [{title: {contains: \"" + this.state.searchedText + "\"}}, {content: {contains: \"" + this.state.searchedText + "\"}}]}, {or: [";
		this.state.statusMap.map((status: Status, index: number) => {
			if(index!=0){
				queryInputs += ", ";
			}	
			queryInputs += "{status: {eq: \"" + status.value + "\"}}";
		});
		queryInputs += "]}]}";

		const allResults = await sudographActor.query(gql`
			query {
				readQuestion(` + queryInputs + `) {
					id
				}
			}
		`);

		this.setState({
			totalQuestions : allResults.data.readQuestion.length,
		});

		// Limit the number of questions per page
		queryInputs += "limit: " + this.state.questionsPerPage
		// Offset from page index
		queryInputs += "offset: " + (this.state.pageIndex * this.state.questionsPerPage);

		const pageResults = await sudographActor.query(gql`
			query {
				readQuestion(` + queryInputs + `) {
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
		`);

		this.setState({
			questions : pageResults.data.readQuestion,
		});
	}

	getArrow = (field: string) => {
		return this.state.orderField === field ? (this.state.orderIsAscending ? "↑" : "↓") : "";
	}

	getProgressColors = (status) => {
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

	render() {
		return (
		<>
			<div className="relative overflow-x-auto shadow-md sm:rounded-lg"> 
					<label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300">Search questions</label>
					<div className="relative">
							<div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
									<svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
							</div>
							<input type="text" value={this.state.searchedText} onChange={this.setSearchedText} className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search questions..." required/>
					</div>
					<ReactSelect
						options={allStatus}
						isMulti={true}
						isSearchable={false}
						closeMenuOnSelect={false}
						hideSelectedOptions={false}
						components={{
							Option
						}}
						onChange={this.setStatusMap}
						value={this.state.statusMap}
					/>
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
								<button onClick={() => {this.setOrderField("reward"); this.setOrderIsAscending(!this.state.orderIsAscending);}}>Reward { this.getArrow("reward") }</button>
							</th>
							<th scope="col" className="px-6 py-3">
								<button onClick={() => {this.setOrderField("status_end_date"); this.setOrderIsAscending(!this.state.orderIsAscending);}}>Deadline { this.getArrow("status_end_date") }</button>
							</th>
						</tr>
					</thead>
					<tbody>
					{this.state.questions.map((question: any) => {
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
										<div className={`basis-5 h-1.5 ${this.getProgressColors(question.status)[0]} dark:${this.getProgressColors(question.status)[0]}`}/>
										<div className={`basis-5 h-1.5 ${this.getProgressColors(question.status)[1]} dark:${this.getProgressColors(question.status)[1]}`}/>
										<div className={`basis-5 h-1.5 ${this.getProgressColors(question.status)[2]} dark:${this.getProgressColors(question.status)[2]}`}/>
										<div className={`basis-5 h-1.5 ${this.getProgressColors(question.status)[3]} dark:${this.getProgressColors(question.status)[3]}`}/>
										<div className={`basis-5 h-1.5 ${this.getProgressColors(question.status)[4]} dark:${this.getProgressColors(question.status)[4]}`}/>
									</div>
									</td>
									<td className="px-6 py-4">
										{e3sToIcp(Number(question.reward))} ICP
									</td>
									<td className="px-6 py-4 text-right">
										{graphQlToJsDate(question.status_end_date).toLocaleString(
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
				<div className="flex flex-col items-center">
				<span className="text-sm text-gray-700 dark:text-gray-400">
					Showing <span className="font-semibold text-gray-900 dark:text-white">{this.state.pageIndex * this.state.questionsPerPage + 1}</span> to <span className="font-semibold text-gray-900 dark:text-white">{Math.min((this.state.pageIndex + 1) * this.state.questionsPerPage, this.state.totalQuestions)}</span> of <span className="font-semibold text-gray-900 dark:text-white">{this.state.totalQuestions}</span> Entries
				</span>
						<div className="inline-flex mt-2 xs:mt-0">
						<button disabled={this.state.pageIndex < 1} onClick={() => {this.setPageIndex(this.state.pageIndex - 1)}} className="inline-flex items-center py-2 px-4 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
						<svg className="mr-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path></svg>
							Prev
						</button>
						<button disabled={((this.state.pageIndex + 1) * this.state.questionsPerPage) >= this.state.totalQuestions} onClick={() => {this.setPageIndex(this.state.pageIndex + 1)}} className="inline-flex items-center py-2 px-4 text-sm font-medium text-white bg-gray-800 rounded-r border-0 border-l border-gray-700 hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
							Next
						<svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
						</button>
					</div>
				</div>
			</div>
		</>
		)
	};
};
