import { Actor, HttpAgent } from "@dfinity/agent";

// ------------------------------- ACTOR ------------------------------------

const idlFactory = ({ IDL }) => {
	return IDL.Service({
		graphql_query: IDL.Func([IDL.Text, IDL.Text], [IDL.Text], ["query"]),
		// delete later on
		graphql_mutation: IDL.Func([IDL.Text, IDL.Text], [IDL.Text], []),
	});
};
const agent = new HttpAgent();

if (process.env.NODE_ENV !== "production") {
	agent.fetchRootKey().catch((err) => {
		console.warn(
			"Unable to fetch root key. Check to ensure that your local replica is running"
		);
		console.error(err);
	});
}

export const actor = Actor.createActor(idlFactory, {
	agent,
	canisterId: `${process.env.GRAPHQL_CANISTER_ID}`,
});

// ------------------------------------ Query ------------------------------------

export const get_invoice = async (invoiceId) => {
	var res: any = await actor.graphql_query(
		`query ($invoice_id:ID!){
        readInvoice (search: {id: {eq: $invoice_id} } ) {
          id
          buyer
        }
      }`,
		JSON.stringify({ invoice_id: `${invoiceId}` })
	);

	return JSON.parse(res);
};

export const get_question_by_invoice = async (invoiceId) => {
	var res: any = await actor.graphql_query(
		`query ($invoice_id: ID!) {
        readQuestion(
          search: {author_invoice: {id: {eq: $invoice_id}}}
        ) {
          id
          author
          author_invoice {
            id
            buyer
          }
          creation_date
          status
          status_update_date
          open_duration
          title
          content
          reward
          winner {
            id
            author
            creation_date
            content
          }
          close_transaction_block_height
        }
      }`,
		JSON.stringify({ invoice_id: `${invoiceId}` })
	);

	return JSON.parse(res);
};

export const get_question = async (questionId) => {
	var res: any = await actor.graphql_query(
		`query ($question_id:ID!){
            readQuestion (search: {id: {eq: $question_id} } ) {
              id
              author
              author_invoice {
                id
                buyer
              }
              creation_date
              status
              status_update_date
              open_duration
              title
              content
              reward
              winner {
                id
                author
                creation_date
                content
              }
              close_transaction_block_height
            }
          }`,
		JSON.stringify({
			question_id: `${questionId}`,
		})
	);

	return JSON.parse(res);
};

export const get_questions = async () => {
	var res: any = await actor.graphql_query(
		`query {
        readQuestion {
          id
          author
          author_invoice {
            id
            buyer
          }
          creation_date
          status
          status_update_date
          open_duration
          title
          content
          reward
          winner {
            id
            author
            creation_date
            content
          }
          close_transaction_block_height
        }
      }`,
		JSON.stringify({})
	);

	return JSON.parse(res);
};

export const get_answer = async (questionId, answerId) => {
	var res: any = await actor.graphql_query(
		`query ($question_id: ID!, $answer_id: ID!) {
        readAnswer(
          search: {and: [{question: {id: {eq: $question_id}}}, {id: {eq: $answer_id}}]}
        ) {
          id
          author
          creation_date
          content
        }
      }`,
		JSON.stringify({ question_id: `${questionId}`, answer_id: `${answerId}` })
	);

	return JSON.parse(res);
};

// is author principal?
export const get_question_answers_from_author = async (questionId, author) => {
	var res: any = await actor.graphql_query(
		`query ($question_id: ID!, $author: String!) {
        readAnswer(
          search: {and: [{question: {id: {eq: $question_id}}}, {author: {eq: $author}}]}
        ) {
          id
          author
          creation_date
          content
        }
      }`,
		JSON.stringify({ question_id: `${questionId}`, author: `${author}` })
	);

	return JSON.parse(res);
};

export const get_question_answers = async (questionId) => {
	var res: any = await actor.graphql_query(
		`query ($question_id: ID!) {
        readAnswer(
          search: {question: {id: {eq: $question_id}}}
        ) {
          id
          author
          creation_date
          content
        }
      }`,
		JSON.stringify({ question_id: `${questionId}` })
	);

	return JSON.parse(res);
};

export const get_questions_interactions = async (author) => {
	var res: any = await actor.graphql_query(
		`query ($author: String!) {
      readQuestion(search: {or:[ {answers: {author: {eq: $author}}}, {author:{eq: $author}}]}) {
        id
        author
        author_invoice {
          id
          buyer
        }
        creation_date
        status
        status_update_date
        content
        title
        reward
        winner {
          id
          author
          creation_date
          content
        }
        close_transaction_block_height        
      }
    }
    `,
		JSON.stringify({ author: `${author}` })
	);

	return JSON.parse(res);
};

// ------------------------------------ Update ------------------------------------

// Example:
/* var questionOject = {
	author: "author",
	invoice_id: "2",
	creation_date: 4,
	status_update_date: 4,
	content: "content",
	reward: 7,
}; */
const create_question = async (questionConfig) => {
	var res: any = await actor.graphql_mutation(
		`mutation ($author: String!, $invoice_id: ID!, $creation_date: Int!, $open_duration: Int!, $title: String!, $content: String!, $reward: Int!) {
    createQuestion(
      input: {author: $author, author_invoice: {connect: $invoice_id}, creation_date: $creation_date, status: OPEN, status_update_date: $creation_date, open_duration: $open_duration, title: $title, content: $content, reward: $reward}
    ) {
      id
      author
      author_invoice {
        id
        buyer
      }
      creation_date
      status
      status_update_date
      open_duration
      title
      content
      reward
      winner {
        id
        author
        creation_date
        content
      }
      close_transaction_block_height
    }
  }`,
		JSON.stringify({
			author: "author",
			invoice_id: "2",
			creation_date: 4,
			open_duration: 4320,
			title: "title",
			content: "content",
			reward: 7,
		})
	);

	return JSON.parse(res);
};

export default {
	get_invoice,
	get_question_by_invoice,
	get_question,
	get_questions,
	get_answer,
	get_question_answers_from_author,
	get_question_answers,
	get_questions_interactions,
	create_question,
};
