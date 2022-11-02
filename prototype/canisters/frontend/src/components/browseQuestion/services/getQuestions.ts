import { gql, sudograph } from "sudograph";
import {
	e3sToIcp,
	statusToValue,
	valueToStatus,
} from "../../core/services/utils/conversions";

type Status = { value: string; label: string };

const getQuestions = async (
	orderField,
	orderIsAscending,
	searchedText,
	statusMap,
	myInteractions,
	userPrincipal,
	questionsPerPage,
	pageIndex
) => {
	console.log(statusMap);
	let sudographActor = sudograph({
		canisterId: `${process.env.GRAPHQL_CANISTER_ID}`,
	});

	var questionData = {
		totalQuestions: 0,
		questions: [],
		timestamp: Date.now(),
	};

	var queryInputs: string = "";
	// Add the ordering on a field (ascendant or descendant)
	queryInputs +=
		"order: {" + orderField + ": " + (orderIsAscending ? "ASC" : "DESC") + "}";
	// Filter the search on key-words (currently hard-coded on question title and content)
	// and selected status
	queryInputs +=
		' search: {and: [{or: [{title: {contains: "' +
		searchedText +
		'"}}, {content: {contains: "' +
		searchedText +
		'"}}]}';

	// Query part for the status filter
	queryInputs += "," + "{or: [";

	// if none selected it does not need to fetch
	if (statusMap.length === 0) {
		return questionData;
	}

	if (statusMap.length > 0) {
		statusMap.map((status: Status, index: number) => {
			if (index != 0) {
				queryInputs += ", ";
			}
			queryInputs += "{status: {eq: " + statusToValue(status) + "}}";
		});
	}
	queryInputs += "]}";

	// self contained query
	if (myInteractions) {
		queryInputs += `,{or: [{answers: {author: {id: {eq:"${userPrincipal}"}}}}, {author: {id: {eq: "${userPrincipal}"}}}]}`;
	}

	// final query close
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
	queryInputs += " limit: " + questionsPerPage;
	// Offset from page index
	queryInputs += " offset: " + pageIndex * questionsPerPage;

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
				creation_date
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

	var questions = pageResults.data.readQuestion;
	for (var i = 0; i < questions.length; i++) {
		questions[i].reward = e3sToIcp(questions[i].reward);
		questions[i].status = valueToStatus(questions[i].status);
	}
	questionData.totalQuestions = allResults.data.readQuestion.length;
	questionData.questions = pageResults.data.readQuestion;
	questionData.timestamp = Date.now();
	return questionData;
};

export default getQuestions;
