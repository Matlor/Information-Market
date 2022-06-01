export const e8sToIcp = (e8s: number) => {
	return e8s / 100000000;
};

export const icpToE8s = (icp: number) => {
	return icp * 100000000;
};

export const statusMessageTransformer = (status) => {
	switch (status) {
		case "OPEN":
			return "Open";
		case "PICKANSWER":
			return "Winner Selection";
		case "DISPUTABLE":
			return "Open for disputes";
		case "DISPUTED":
			return "Arbitration";
		case "CLOSED":
			return "Closed";
	}
};
