// import names of screens as a type (and role and status as types)
const ConditionToViews = (role, status) => {
	//console.log("status:", status);
	//console.log("role:", role);

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

/* switch (true) {
        case status === "open" && role === "author":
            return "GetAnswers";
        case status === "open" && role === "answerer":
            return "Answer";
        case status === "open" && role === "unrelated":
            return "Answer";
        case status === "open" && role === "anonymous":
            return "ConnectToAnswer";

        case status === "pickanswer" && role === "author":
            return "pickanswer";
        case status === "pickanswer" && role === "answerer":
            return "ongoing";
        case status === "pickanswer" && role === "unrelated":
            return "ongoing";
        case status === "pickanswer" && role === "anonymous":
            return "ongoing";
            
        case status === "disputable" && role === "answerer":
            return "disputable";
        case status === "disputable" && role === "author":
            return "ongoing";
        case status === "disputable" && role === "unrelated":
            return "ongoing";
        case status === "disputable" && role === "anonymous":
            return "ongoing";

        case status === "arbitration":
            return "ongoing";

        case status === "payout":
            return "ongoing";

        case status === "closed":
            return "closed";
        default:
            return "default";
    } */
