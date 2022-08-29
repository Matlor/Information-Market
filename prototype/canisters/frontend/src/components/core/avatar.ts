import { blobToBase64Str } from "../../utils/conversions";
import sudograph from "../../api/sudograph";

const loadAvatar = async (user_id: string) => {
	const query_avatar = await sudograph.query_avatar(user_id);

	// TO DO: investigate if fetch + createObjectURL would make more sense
	let avatar = blobToBase64Str(query_avatar.data.readUser[0].avatar);

	return avatar;
};

export default {
	loadAvatar,
};
