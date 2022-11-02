import { gql, sudograph } from "sudograph";
import { e3sToIcp } from "../../core/services/utils/conversions";

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
		'search: {and: [{or: [{title: {contains: "' +
		searchedText +
		'"}}, {content: {contains: "' +
		searchedText +
		'"}}]}, {or: [';

	if (statusMap.length === 0) {
		return questionData;
	}
	if (statusMap.length > 0) {
		statusMap.map((status: Status, index: number) => {
			if (index != 0) {
				queryInputs += ", ";
			}
			queryInputs += '{status: {eq: "' + status.value + '"}}';
		});
	}
	queryInputs += "]}";
	if (myInteractions) {
		queryInputs += `,{or: [{answers: {author: {id: {eq:"${userPrincipal}"}}}}, {author: {id: {eq: "${userPrincipal}"}}}]}`;
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
	}
	questionData.totalQuestions = allResults.data.readQuestion.length;
	questionData.questions = pageResults.data.readQuestion;
	questionData.timestamp = Date.now();
	return questionData;
};

export default getQuestions;
