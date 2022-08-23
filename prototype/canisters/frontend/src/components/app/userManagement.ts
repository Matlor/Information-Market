import { graphQlToStrDate, blobToBase64Str } from "../../utils/conversions";

const refreshUser = async (setUser, plug, sudograph, gql) => {
	// If plug is not connect, empty user info
	if (!plug.isConnected) {
		setUser({ userName: "", joinedDate: "", avatar: "" });
		return;
	}
	// Create a new user if no user has been found
	if (!(await fetchCurrentUser(setUser, sudograph, gql))) {
		console.log("Create new user");
		let motoko_image = await fetch("motoko.jpg");
		var reader = new FileReader();
		reader.readAsDataURL(await motoko_image.blob());
		reader.onloadend = async function () {
			let createUser = await plug.actors.marketActor.create_user(
				window.ic.plug.principalId,
				"New User",
				reader.result
			);
			if (!createUser.ok) {
				setUser({ userName: "", joinedDate: "", avatar: "" });
				console.error("Failed to create a new user!");
				return;
			}
			await fetchCurrentUser(setUser, sudograph, gql);
		};
	}
};

const fetchCurrentUser = async (setUser, sudograph, gql) => {
	let sudographActor = sudograph({
		canisterId: `${process.env.GRAPHQL_CANISTER_ID}`,
	});
	let principal_id: string = window.ic.plug.principalId;
	const fetchUser = await sudographActor.query(
		gql`
			query ($principal_id: ID!) {
				readUser(search: { id: { eq: $principal_id } }) {
					name
					joined_date
					avatar
				}
			}
		`,
		{ principal_id }
	);
	if (fetchUser.data.readUser.length === 0) {
		setUser({ userName: "", joinedDate: "", avatar: "" });
		return false;
	} else {
		setUser({
			userName: fetchUser.data.readUser[0].name,
			joinedDate: graphQlToStrDate(fetchUser.data.readUser[0].joined_date),
			avatar: blobToBase64Str(fetchUser.data.readUser[0].avatar),
		});
		return true;
	}
};

export default {
	refreshUser,
};
