export const e8sToIcp = (e8s: number) => {
	return e8s / 100000000;
};

export const icpToE8s = (icp: number) => {
	return icp * 100000000;
};

export const questionStatusToString = (status) => {
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

export const graphQlToJsDate = (minutes) => {
	// Date is in milliseconds
	return new Date(minutes * 60 * 1000);
};

export const jsToGraphQlDate = (date) => {
	// Date is in milliseconds
	return Math.floor(date / 60000);
};

export const toHHMMSS = (durationSeconds: number) => {
	let hours   = Math.floor(durationSeconds / 3600);
	let minutes = Math.floor((durationSeconds - (hours * 3600)) / 60);
	let seconds = Math.floor(durationSeconds - (hours * 3600) - (minutes * 60));

	var hoursStr = hours.toString();
	if (hours   < 10) {hoursStr   = "0"+hoursStr;}
	var minutesStr = minutes.toString();
	if (minutes < 10) {minutesStr = "0"+minutesStr;}
	var secondsStr = seconds.toString();
	if (seconds < 10) {secondsStr = "0"+secondsStr;}
	
	return hoursStr+':'+minutesStr+':'+secondsStr;
}