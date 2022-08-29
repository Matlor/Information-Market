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

const actor = Actor.createActor(idlFactory, {
	agent,
	canisterId: `${process.env.GRAPHQL_CANISTER_ID}`,
});

// ------------------------------------ Query ------------------------------------

const get_question = async (questionId) => {
	var res: any = await actor.graphql_query(
		`query ($question_id:ID!){
            readQuestion (search: {id: {eq: $question_id} } ) {
              id
              author {
                id
                name
                joined_date
              }
              author_invoice {
                id
                buyer {
                  id
                  name
                  joined_date
                }
              }
              creation_date
              status
              status_update_date
              status_end_date
              open_duration
              title
              answers {
                id
                author {
                  id
                }
              }
              content
              reward
              winner {
                id
                author {
                  id
                  name
                  joined_date
                }
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

const get_question_answers = async (questionId) => {
	var res: any = await actor.graphql_query(
		`query ($question_id: ID!) {
        readAnswer(
          search: {question: {id: {eq: $question_id}}}
        ) {
          id
          author {
            id
            name
            joined_date
          }
          creation_date
          content
        }
      }`,
		JSON.stringify({ question_id: `${questionId}` })
	);

	return JSON.parse(res);
};

const fetchUser = async (principal_id) => {
	var res: any = await actor.graphql_query(
		`query ($principal_id: ID!) {
      readUser(search: { id: { eq: $principal_id } }) {
        name
        joined_date
        avatar
      }
    }`,
		JSON.stringify({ principal_id: `${principal_id}` })
	);

	return JSON.parse(res);
};

const query_avatar = async (user_id) => {
	var res: any = await actor.graphql_query(
		`query ($user_id: ID!) {
      readUser(search: { id: { eq: $user_id } }) {
        avatar
      }
    }`,
		JSON.stringify({ user_id: `${user_id}` })
	);

	return JSON.parse(res);
};

export default {
	get_question,
	get_question_answers,
	fetchUser,
	query_avatar,
};
