import { gql, sudograph } from "sudograph";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { LoremIpsum } from "lorem-ipsum";
import { jsToGraphQlDate } from "./conversions";

var sudographActor = sudograph({
	canisterId: `${process.env.GRAPHQL_CANISTER_ID}`,
});

async function getNumberQuestions(): Promise<number> {
	const result = await sudographActor.query(gql`
		query {
			readQuestion {
				id
			}
		}
	`);
	if (result.data == null) {
		return 0;
	} else {
		return result.data.readQuestion.length;
	}
}

// for debugging
const get_question = async (questionId) => {
	var res: any = await sudographActor.query(
		gql`
			query ($question_id: ID!) {
				readQuestion(search: { id: { eq: $question_id } }) {
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
			}
		`,
		{ question_id: `${questionId}` }
	);
	return JSON.stringify(res);
};

async function getUser(user_name: String): Promise<Array<string>> {
	const result = await sudographActor.query(
		gql`
			query ($user_name: String!) {
				readUser(search: { name: { eq: $user_name } }) {
					id
				}
			}
		`,
		{ user_name }
	);
	return result.data.readUser;
}

async function createUser(
	user_id: String,
	name: String,
	joined_date: number
): Promise<String> {
	const result = await sudographActor.mutation(
		gql`
			mutation ($user_id: ID!, $name: String!, $joined_date: Int!) {
				createUser(
					input: { id: $user_id, name: $name, joined_date: $joined_date }
				) {
					id
				}
			}
		`,
		{ user_id, name, joined_date }
	);
	console.debug("Create user: " + JSON.stringify(result));
	return result.data.createUser[0].id;
}

async function createInvoice(buyer_id: String): Promise<String> {
	const result = await sudographActor.mutation(
		gql`
			mutation ($buyer_id: ID!) {
				createInvoice(input: { buyer: { connect: $buyer_id } }) {
					id
				}
			}
		`,
		{ buyer_id }
	);
	console.debug("Create invoice: " + JSON.stringify(result));
	return result.data.createInvoice[0].id;
}

async function createQuestion(
	author_id: String,
	invoice_id: String,
	creation_date: number,
	open_duration: number,
	title: String,
	content: String,
	reward: number
): Promise<String> {
	let status_end_date: number = creation_date + open_duration;

	const result = await sudographActor.mutation(
		gql`
			mutation (
				$author_id: ID!
				$invoice_id: ID!
				$creation_date: Int!
				$status_end_date: Int!
				$open_duration: Int!
				$title: String!
				$content: String!
				$reward: Int!
			) {
				createQuestion(
					input: {
						author: { connect: $author_id }
						author_invoice: { connect: $invoice_id }
						creation_date: $creation_date
						status: OPEN
						status_update_date: $creation_date
						status_end_date: $status_end_date
						open_duration: $open_duration
						title: $title
						content: $content
						reward: $reward
					}
				) {
					id
				}
			}
		`,
		{
			author_id,
			invoice_id,
			creation_date,
			status_end_date,
			open_duration,
			title,
			content,
			reward,
		}
	);
	console.debug("Create question: " + JSON.stringify(result));
	return result.data.createQuestion[0].id;
}

async function createAnswer(
	question_id: String,
	author_id: String,
	creation_date: number,
	content: String
): Promise<String> {
	const result = await sudographActor.mutation(
		gql`
			mutation (
				$question_id: ID!
				$author_id: ID!
				$creation_date: Int!
				$content: String!
			) {
				createAnswer(
					input: {
						question: { connect: $question_id }
						author: { connect: $author_id }
						creation_date: $creation_date
						content: $content
					}
				) {
					id
				}
			}
		`,
		{ question_id, author_id, creation_date, content }
	);
	console.debug("Create answer: " + JSON.stringify(result));
	return result.data.createAnswer[0].id;
}

async function setWinner(
	question_id: String,
	answer_id: String
): Promise<String> {
	const result = await sudographActor.mutation(
		gql`
			mutation ($question_id: ID!, $answer_id: ID!) {
				updateQuestion(
					input: { id: $question_id, winner: { connect: $answer_id } }
				) {
					id
				}
			}
		`,
		{ question_id, answer_id }
	);
	console.debug("Set winner: " + JSON.stringify(result));
	return result.data.updateQuestion[0].id;
}

async function setStatus(
	question_id: String,
	status: String,
	status_update_date: number,
	status_end_date: number
): Promise<String> {
	const result = await sudographActor.mutation(
		gql`
			mutation (
				$question_id: ID!
				$status_update_date: Int!
				$status_end_date: Int!
				$status: QuestionStatus!
			) {
				updateQuestion(
					input: {
						id: $question_id
						status_update_date: $status_update_date
						status_end_date: $status_end_date
						status: $status
					}
				) {
					id
				}
			}
		`,
		{ question_id, status, status_end_date, status_update_date }
	);
	console.debug("Set status: " + JSON.stringify(result));
	return result.data.updateQuestion[0].id;
}

async function generateUsers(names: Array<String>, minutesFromNow: number) {
	var array: Array<String> = new Array();
	for (var i = 0; i < names.length; ++i) {
		let user = await getUser(names[i]);
		if (user.length != 0) {
			let actual_user: any = user[0];
			array.push(actual_user.id);
		} else {
			array.push(
				await createUser(
					Ed25519KeyIdentity.generate().getPrincipal().toString(),
					names[i],
					getRandomPastDate(minutesFromNow)
				)
			);
		}
	}
	return array;
}

function getRandomPastDate(minutesFromNow: number) {
	return jsToGraphQlDate(
		Date.now() - (Math.floor(Math.random() * minutesFromNow * 60000) + 1)
	);
}

function getRandomDuration(maxDuration: number) {
	return Math.floor(Math.random() * maxDuration) + 1;
}

function getRandomRewardE3s() {
	// Max integer is 2bil, here do random from 0 to 1 million e3s, hence 0 to 1000 ICPs
	let exponent = Math.floor(Math.random() * 6) + 1;
	return Math.floor(Math.random() * 10 ** exponent);
}

const loadScenario = async (
	names: Array<String>,
	questionNumber: number,
	minutesInPast: number,
	minutesToGo: number
) => {
	const lorem = new LoremIpsum({
		sentencesPerParagraph: {
			max: 4,
			min: 2,
		},
		wordsPerSentence: {
			max: 12,
			min: 4,
		},
	});

	let now = jsToGraphQlDate(Date.now());

	console.debug("Start loading scenario...");

	let generated_users = await generateUsers(names, minutesInPast);

	let numToCreate = Math.max(questionNumber - (await getNumberQuestions()), 0);
	if (numToCreate > 0) {
		console.debug(
			"Add " + numToCreate + " question(s) from " + names.length + " users."
		);
	}

	let questionMap = new Map<String, Set<String>>();

	for (let i = 0; i < numToCreate; i++) {
		var users = generated_users.slice();
		let creationDate = getRandomPastDate(minutesInPast);

		let user_id = users.splice(Math.floor(Math.random() * users.length), 1)[0];

		let question = await createQuestion(
			user_id,
			await createInvoice(user_id),
			creationDate,
			now - creationDate + getRandomDuration(minutesToGo),
			lorem.generateWords(),
			lorem.generateSentences(),
			getRandomRewardE3s()
		);
		console.debug("Question from user id: " + user_id);

		let answerSet = new Set<String>();
		while (users.length > 0) {
			let author_id = users.splice(
				Math.floor(Math.random() * users.length),
				1
			)[0];

			// Half pourcentage of chance to give an answer
			if (Math.floor(Math.random() * 2)) {
				answerSet.add(
					await createAnswer(
						question,
						author_id,
						getRandomPastDate(now - creationDate),
						lorem.generateSentences()
					)
				);
				console.debug("Answer from author id: " + author_id);
			}
		}

		questionMap.set(question, answerSet);
	}

	// TODO: right now, the status update date might be before the question's creation date or answers' dates
	for (let [question, answers] of questionMap) {
		let rand = Math.floor(Math.random() * 100) + 1;
		let status_update_date = getRandomPastDate(minutesInPast);
		let status_end_date = status_update_date + getRandomDuration(minutesToGo);

		if (rand < 40) {
			// 40% of questions will be OPEN
			continue;
		} else if (rand < 55) {
			// 15% of questions will be PICKANSWER
			await setStatus(
				question,
				"PICKANSWER",
				status_update_date,
				status_end_date
			);
		} else if (rand < 75) {
			// 20% (max) of questions will be DISPUTABLE
			if (answers.size == 0) {
				// no winner has to be set
				await setStatus(
					question,
					"CLOSED",
					status_update_date,
					status_end_date
				);
			} else {
				// there were answers and the author is now picking a winner
				await setWinner(question, [...answers][0]);
				await setStatus(
					question,
					"DISPUTABLE",
					status_update_date,
					status_end_date
				);
			}
		} else if (rand < 90) {
			// 15% (max) of questions will be DISPUTED

			// directly created as Disputed, we have to check for 0 answers again
			if (answers.size == 0) {
				await setStatus(
					question,
					"CLOSED",
					status_update_date,
					status_end_date
				);

				// has received answers
			} else {
				// Half of the disputed questions won't have a picked winner,
				// to simulate when the question's author didn't pick any winner

				// There were answers
				// Now we simulate that for some of them
				// The author picked a winner and for some not
				// And then set the State to DISPUTED.
				// That makes it ready for us to do the arbitration with the terminal.
				if (Math.floor(Math.random() * 2)) {
					// This will pick a winning answer randomly, since it's based on the answer identifier
					await setWinner(question, [...answers][0]);
				}

				// Now we are entering the Arbitration state.
				// I have to do arbitration with the terminal!
				await setStatus(
					question,
					"DISPUTED",
					status_update_date,
					status_end_date
				);
			}
		} else {
			// 10% (min) of questions will be CLOSED

			// In the closed state a winner should always be set
			// If the number of answer is 0, we'd need to trigger a refund, which is not yet supported.
			if (answers.size === 0) {
				// The user should be refunded here but the backend does not allow for this yet
				// Instead we do not set the status to closed
			} else {
				// Before we set winner and status question is in "OPEN" and contain answers
				await setWinner(question, [...answers][0]);
				await setStatus(
					question,
					"CLOSED",
					status_update_date,
					status_end_date
				);
			}
		}
	}
	console.debug("Loading scenario finished!");
};

export default {
	loadScenario,
};
