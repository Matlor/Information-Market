import { market } from "../../../../declarations/market";

export const getMinReward = async () => {
	try {
		const res = await market.get_min_reward();
		if (Number(res)) {
			return Number(res);
		}
	} catch (error) {
		console.error("Failed to get min reward: " + error);
		return null;
	}
};
