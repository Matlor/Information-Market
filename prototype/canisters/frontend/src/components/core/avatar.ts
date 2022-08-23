import { blobToBase64Str } from "../../utils/conversions";

const loadAvatars = async function (
	questions: any,
	cachedAvatars,
	setCachedAvatars,
	sudograph,
	gql
) {
	try {
		for (var i = 0; i < questions.length; i++) {
			let question: any = questions[i];
			if (!cachedAvatars.has(question.author.id)) {
				await loadAvatar(question.author.id, setCachedAvatars, sudograph, gql);
			}
			for (var j = 0; j < question.answers.length; j++) {
				let answer: any = question.answers[j];
				if (!cachedAvatars.has(answer.author.id)) {
					await loadAvatar(answer.author.id, setCachedAvatars, sudograph, gql);
				}
			}
		}
	} catch (error) {
		console.error("Failed to load avatars!");
	}
};

const loadAvatar = async (
	user_id: string,
	setCachedAvatars,
	sudograph,
	gql
) => {
	let sudographActor = sudograph({
		canisterId: `${process.env.GRAPHQL_CANISTER_ID}`,
	});
	const query_avatar = await sudographActor.query(
		gql`
			query ($user_id: ID!) {
				readUser(search: { id: { eq: $user_id } }) {
					avatar
				}
			}
		`,
		{ user_id }
	);
	// TO DO: investigate if fetch + createObjectURL would make more sense
	let avatar = blobToBase64Str(query_avatar.data.readUser[0].avatar);
	setCachedAvatars((prev) => new Map([...prev, [user_id, avatar]]));
};

export default {
	loadAvatars,
};
