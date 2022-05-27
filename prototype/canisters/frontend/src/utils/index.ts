export const e8sToIcp = (e8s: number) => {
	return e8s / 100000000;
};

export const icpToE8s = (icp: number) => {
	return icp * 100000000;
};

export const fromArray = async (array) => {
	const blob = new Blob([new Uint8Array(array)], {
		type: "text/plain",
	});

	console.log(blob);

	return JSON.parse(await blob.text());
};

export const toArray = async (data) => {
	const blob = new Blob([JSON.stringify(data)], {
		type: "application/json; charset=utf-8",
	});
	return [new Uint16Array(await blob.arrayBuffer())];
};
