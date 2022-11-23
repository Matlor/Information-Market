export const e3sToIcp = (e3s: number) => {
	return e3s / 1000;
};

export const icpToE3s = (icp: number) => {
	return icp * 1000;
};

export const e8sToIcp = (e8s: any) => {
	return Number(e8s) / 10 ** 8;
};

export const icpToE8s = (icp: number) => {
	// TODO: do multiplication outside bigint, it currently fails because not supported by target env
	return BigInt(icp * 10 ** 8);
};

export const e8sToE3s = (num: number) => {
	return num / 100000;
};

export const e3sToE8s = (num: number) => {
	return num * 100000;
};

export const questionStatusToString = (status) => {
	switch (status) {
		case "OPEN":
			return "Open";
		case "PICKANSWER":
			return "Winner Selection";
		case "DISPUTABLE":
			return "Open for Disputes";
		case "DISPUTED":
			return "Arbitration";
		case "CLOSED":
			return "Closed";
	}
};

export const statusToValue = (status) => {
	switch (status.value) {
		case "OPEN":
			return 0;
		case "PICKANSWER":
			return 1;
		case "DISPUTABLE":
			return 2;
		case "DISPUTED":
			return 3;
		case "CLOSED":
			return 4;
		default:
			return 10;
	}
};

export const valueToStatus = (value) => {
	switch (value) {
		case 0:
			return "OPEN";
		case 1:
			return "PICKANSWER";
		case 2:
			return "DISPUTABLE";
		case 3:
			return "DISPUTED";
		case 4:
			return "CLOSED";
		default:
			return 10;
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

export const graphQlToStrDate = (minutes) => {
	return graphQlToJsDate(minutes).toLocaleString("en-US", {
		hour: "numeric",
		minute: "numeric",
		month: "long",
		day: "numeric",
	});
};

export const blobToBase64Str = (blob) => {
	return blob.map((x) => String.fromCharCode(x)).join("");
};

export const toHHMM = (durationMinutes: number) => {
	if (durationMinutes <= 0) {
		return "00:00";
	}
	let hours = Math.floor(durationMinutes / 60);
	let minutes = Math.floor(durationMinutes - hours * 60);

	var hoursStr = hours.toString();
	if (hours < 10) {
		hoursStr = "0" + hoursStr;
	}
	var minutesStr = minutes.toString();
	if (minutes < 10) {
		minutesStr = "0" + minutesStr;
	}

	return hoursStr + ":" + minutesStr;
};
