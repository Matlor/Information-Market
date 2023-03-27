// import names of screens as a type (and role and status as types)
const ConditionToViews = (role, status) => {
	const views = {
		OPEN: {
			author: "getAnswers",
			answerer: "answer",
			unrelated: "answer",
			anonymous: "connectToAnswer",
		},
		PICKANSWER: {
			author: "pick",
			answerer: "ongoing",
			unrelated: "ongoing",
			anonymous: "ongoing",
		},
		DISPUTABLE: {
			author: "ongoing",
			answerer: "dispute",
			unrelated: "ongoing",
			anonymous: "ongoing",
		},
		ARBITRATION: "ongoing",
		PAYOUT: "ongoing",
		CLOSED: "closed",
	};

	const statusViews = views[status];
	if (typeof statusViews === "string") {
		return statusViews;
	} else if (typeof statusViews === "object" && statusViews[role]) {
		return statusViews[role];
	} else {
		throw new Error("Unexpected input: role or status is not valid");
	}
};

export default ConditionToViews;
