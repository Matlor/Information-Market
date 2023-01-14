const initiatorId =
	"tsm3f-vuuza-xfy3b-wcbrx-r4nzg-jy6o2-ydpbq-67lqa-rgq6j-ijkaa-aqe";
const buyer = { id: initiatorId };

const answerer =
	"4x6qx-tmjtk-uzyzt-ihfyt-3xeeg-aml4y-5v64i-v6u3x-scyy2-mobv5-pae";

const answerer2 =
	"l3rmj-75sdo-35ftk-sa7uf-jrvzg-5dmiz-tzain-74wsy-26p6l-ghp45-7qe";

export const OPEN_NO_ANSWER = {
	question: {
		author_invoice: {
			buyer,
			id: "y6do4v-v3yvs-4e4a5-tc6vd-b5uwj-v4dgx-d7blm-jezte-3faa",
		},
		content:
			"Officia sit consectetur occaecat sint. Laboris labore ipsum cupidatat minim quis commodo deserunt aliqua aliquip duis est.",
		creation_date: 27778416,
		id: "37jwjf-ssrpo-xtfb5-wpxna-tbase-qf2xn-a66uf-6svfl-3c2y",
		open_duration: 92,
		reward: 181,
		title: "fugiat ea qui incididunt elit veniam dolore",
		answers: [],
		author: {
			id: initiatorId,
			joined_date: 27778232,
			name: "Initiator",
		},
		status: "OPEN",
		status_end_date: 27784920,
		status_update_date: 27778422,
		winner: null,
		close_transaction_block_height: null,
	},
	hasData: true,
	answers: [],
};

export const OPEN_ANSWER = {
	question: {
		author_invoice: {
			buyer,
			id: "y6do4v-v3yvs-4e4a5-tc6vd-b5uwj-v4dgx-d7blm-jezte-3faa",
		},
		content:
			"Officia sit consectetur occaecat sint. Laboris labore ipsum cupidatat minim quis commodo deserunt aliqua aliquip duis est.",
		creation_date: 27778416,
		id: "37jwjf-ssrpo-xtfb5-wpxna-tbase-qf2xn-a66uf-6svfl-3c2y",
		open_duration: 92,
		reward: 181,
		title: "fugiat ea qui incididunt elit veniam dolore",
		answers: [
			{
				author: {
					id: answerer,
				},
				id: "iy4vop-xbqcu-pfzg4-5jfau-ccq5m-gyrqu-wmaiz-j5ftz-rpw6",
			},
			{
				author: {
					id: answerer2,
				},
				id: "aaaaa-xbqcu-pfzg4-5jfau-ccq5m-gyrqu-wmaiz-j5ftz-rpw6",
			},
		],
		author: {
			id: initiatorId,
			joined_date: 27778232,
			name: "Initiator",
		},
		status: "OPEN",
		status_end_date: 27778452,
		status_update_date: 27778422,
		winner: null,
		close_transaction_block_height: null,
	},
	hasData: true,
	answers: [
		{
			author: {
				id: answerer,
				joined_date: 27778217,
				name: "Answerer",
			},
			content:
				"Eu veniam consectetur dolor amet do Lorem aliqua cillum. Culpa et veniam quis enim velit. Aute eu duis ut aliqua sint amet.",
			creation_date: 27778423,
			id: "iy4vop-xbqcu-pfzg4-5jfau-ccq5m-gyrqu-wmaiz-j5ftz-rpw6",
		},
		{
			author: {
				id: answerer2,
				joined_date: 27778217,
				name: "Answerer 2",
			},
			content:
				"Eu veniam consectetur dolor amet do Lorem aliqua cillum. Culpa et veniam quis enim velit. Aute eu duis ut aliqua sint amet.",
			creation_date: 27778423,
			id: "aaaaa-xbqcu-pfzg4-5jfau-ccq5m-gyrqu-wmaiz-j5ftz-rpw6",
		},
	],
};

export const PICKANSWER = {
	question: {
		author_invoice: {
			buyer,
			id: "y6do4v-v3yvs-4e4a5-tc6vd-b5uwj-v4dgx-d7blm-jezte-3faa",
		},
		content:
			"Officia sit consectetur occaecat sint. Laboris labore ipsum cupidatat minim quis commodo deserunt aliqua aliquip duis est.",
		creation_date: 27778416,
		id: "37jwjf-ssrpo-xtfb5-wpxna-tbase-qf2xn-a66uf-6svfl-3c2y",
		open_duration: 92,
		reward: 181,
		title: "fugiat ea qui incididunt elit veniam dolore",
		answers: [
			{
				author: {
					id: answerer,
				},
				id: "iy4vop-xbqcu-pfzg4-5jfau-ccq5m-gyrqu-wmaiz-j5ftz-rpw6",
			},
			{
				author: {
					id: answerer2,
				},
				id: "aaaaa-xbqcu-pfzg4-5jfau-ccq5m-gyrqu-wmaiz-j5ftz-rpw6",
			},
		],
		author: {
			id: initiatorId,
			joined_date: 27778232,
			name: "Initiator",
		},
		status: "PICKANSWER",
		status_end_date: 27778452,
		status_update_date: 27778422,
		winner: null,
		close_transaction_block_height: null,
	},
	hasData: true,
	answers: [
		{
			author: {
				id: answerer,
				joined_date: 27778217,
				name: "Answerer",
			},
			content:
				"Eu veniam consectetur dolor amet do Lorem aliqua cillum. Culpa et veniam quis enim velit. Aute eu duis ut aliqua sint amet.",
			creation_date: 27778423,
			id: "iy4vop-xbqcu-pfzg4-5jfau-ccq5m-gyrqu-wmaiz-j5ftz-rpw6",
		},
		{
			author: {
				id: answerer2,
				joined_date: 27778217,
				name: "Answerer 2",
			},
			content:
				"Eu veniam consectetur dolor amet do Lorem aliqua cillum. Culpa et veniam quis enim velit. Aute eu duis ut aliqua sint amet.",
			creation_date: 27778423,
			id: "aaaaa-xbqcu-pfzg4-5jfau-ccq5m-gyrqu-wmaiz-j5ftz-rpw6",
		},
	],
};

export const DISPUTABLE = {
	question: {
		author_invoice: {
			buyer,
			id: "y6do4v-v3yvs-4e4a5-tc6vd-b5uwj-v4dgx-d7blm-jezte-3faa",
		},
		content:
			"Officia sit consectetur occaecat sint. Laboris labore ipsum cupidatat minim quis commodo deserunt aliqua aliquip duis est.",
		creation_date: 27778416,
		id: "37jwjf-ssrpo-xtfb5-wpxna-tbase-qf2xn-a66uf-6svfl-3c2y",
		open_duration: 92,
		reward: 181,
		title: "fugiat ea qui incididunt elit veniam dolore",
		answers: [
			{
				author: {
					id: answerer,
				},
				id: "iy4vop-xbqcu-pfzg4-5jfau-ccq5m-gyrqu-wmaiz-j5ftz-rpw6",
			},
			{
				author: {
					id: "l3rmj-75sdo-35ftk-sa7uf-jrvzg-5dmiz-tzain-74wsy-26p6l-ghp45-7qe",
				},
				id: "aaaaa-xbqcu-pfzg4-5jfau-ccq5m-gyrqu-wmaiz-j5ftz-rpw6",
			},
		],
		author: {
			id: initiatorId,
			joined_date: 27778232,
			name: "Initiator",
		},
		status: "DISPUTABLE",
		status_end_date: 27778452,
		status_update_date: 27778422,
		winner: {
			author: {
				id: answerer,
				joined_date: 27778217,
				name: "Answerer",
			},
			content:
				"Eu veniam consectetur dolor amet do Lorem aliqua cillum. Culpa et veniam quis enim velit. Aute eu duis ut aliqua sint amet.",
			creation_date: 27778423,
			id: "iy4vop-xbqcu-pfzg4-5jfau-ccq5m-gyrqu-wmaiz-j5ftz-rpw6",
		},
		close_transaction_block_height: null,
	},
	hasData: true,
	answers: [
		{
			author: {
				id: answerer,
				joined_date: 27778217,
				name: "Answerer",
			},
			content:
				"Eu veniam consectetur dolor amet do Lorem aliqua cillum. Culpa et veniam quis enim velit. Aute eu duis ut aliqua sint amet.",
			creation_date: 27778423,
			id: "iy4vop-xbqcu-pfzg4-5jfau-ccq5m-gyrqu-wmaiz-j5ftz-rpw6",
		},
		{
			author: {
				id: "l3rmj-75sdo-35ftk-sa7uf-jrvzg-5dmiz-tzain-74wsy-26p6l-ghp45-7qe",
				joined_date: 27778217,
				name: "Answerer 2",
			},
			content:
				"Eu veniam consectetur dolor amet do Lorem aliqua cillum. Culpa et veniam quis enim velit. Aute eu duis ut aliqua sint amet.",
			creation_date: 27778423,
			id: "aaaaa-xbqcu-pfzg4-5jfau-ccq5m-gyrqu-wmaiz-j5ftz-rpw6",
		},
	],
};

// CAN THIS EVEN HAPPEN? AH YES BY HEARTBEAT
export const DISPUTED_NO_ANSWER = {
	question: {
		author_invoice: {
			buyer,
			id: "y6do4v-v3yvs-4e4a5-tc6vd-b5uwj-v4dgx-d7blm-jezte-3faa",
		},
		content:
			"Officia sit consectetur occaecat sint. Laboris labore ipsum cupidatat minim quis commodo deserunt aliqua aliquip duis est.",
		creation_date: 27778416,
		id: "37jwjf-ssrpo-xtfb5-wpxna-tbase-qf2xn-a66uf-6svfl-3c2y",
		open_duration: 92,
		reward: 181,
		title: "fugiat ea qui incididunt elit veniam dolore",
		answers: [],
		author: {
			id: initiatorId,
			joined_date: 27778232,
			name: "Initiator",
		},
		status: "DISPUTED",
		status_end_date: 27778452,
		status_update_date: 27778422,
		winner: {
			author: {
				id: answerer,
				joined_date: 27778217,
				name: "Answerer",
			},
			content:
				"Eu veniam consectetur dolor amet do Lorem aliqua cillum. Culpa et veniam quis enim velit. Aute eu duis ut aliqua sint amet.",
			creation_date: 27778423,
			id: "iy4vop-xbqcu-pfzg4-5jfau-ccq5m-gyrqu-wmaiz-j5ftz-rpw6",
		},
		close_transaction_block_height: null,
	},
	hasData: true,
	answers: [],
};

export const DISPUTED_ANSWER = {
	question: {
		author_invoice: {
			buyer,
			id: "y6do4v-v3yvs-4e4a5-tc6vd-b5uwj-v4dgx-d7blm-jezte-3faa",
		},
		content:
			"Officia sit consectetur occaecat sint. Laboris labore ipsum cupidatat minim quis commodo deserunt aliqua aliquip duis est.",
		creation_date: 27778416,
		id: "37jwjf-ssrpo-xtfb5-wpxna-tbase-qf2xn-a66uf-6svfl-3c2y",
		open_duration: 92,
		reward: 181,
		title: "fugiat ea qui incididunt elit veniam dolore",
		answers: [
			{
				author: {
					id: answerer,
				},
				id: "iy4vop-xbqcu-pfzg4-5jfau-ccq5m-gyrqu-wmaiz-j5ftz-rpw6",
			},
			{
				author: {
					id: answerer2,
				},
				id: "aaaaa-xbqcu-pfzg4-5jfau-ccq5m-gyrqu-wmaiz-j5ftz-rpw6",
			},
		],
		author: {
			id: initiatorId,
			joined_date: 27778232,
			name: "Initiator",
		},
		status: "DISPUTED",
		status_end_date: 27778452,
		status_update_date: 27778422,
		winner: {
			author: {
				id: answerer,
				joined_date: 27778217,
				name: "Answerer",
			},
			content:
				"Eu veniam consectetur dolor amet do Lorem aliqua cillum. Culpa et veniam quis enim velit. Aute eu duis ut aliqua sint amet.",
			creation_date: 27778423,
			id: "iy4vop-xbqcu-pfzg4-5jfau-ccq5m-gyrqu-wmaiz-j5ftz-rpw6",
		},
		close_transaction_block_height: null,
	},
	hasData: true,
	answers: [
		{
			author: {
				id: answerer,
				joined_date: 27778217,
				name: "Answerer",
			},
			content:
				"Eu veniam consectetur dolor amet do Lorem aliqua cillum. Culpa et veniam quis enim velit. Aute eu duis ut aliqua sint amet.",
			creation_date: 27778423,
			id: "iy4vop-xbqcu-pfzg4-5jfau-ccq5m-gyrqu-wmaiz-j5ftz-rpw6",
		},
		{
			author: {
				id: answerer2,
				joined_date: 27778217,
				name: "Answerer 2",
			},
			content:
				"Eu veniam consectetur dolor amet do Lorem aliqua cillum. Culpa et veniam quis enim velit. Aute eu duis ut aliqua sint amet.",
			creation_date: 27778423,
			id: "aaaaa-xbqcu-pfzg4-5jfau-ccq5m-gyrqu-wmaiz-j5ftz-rpw6",
		},
	],
};

export const CLOSED_REFUND = {
	question: {
		author_invoice: {
			buyer,
			id: "y6do4v-v3yvs-4e4a5-tc6vd-b5uwj-v4dgx-d7blm-jezte-3faa",
		},
		content:
			"Officia sit consectetur occaecat sint. Laboris labore ipsum cupidatat minim quis commodo deserunt aliqua aliquip duis est.",
		creation_date: 27778416,
		id: "37jwjf-ssrpo-xtfb5-wpxna-tbase-qf2xn-a66uf-6svfl-3c2y",
		open_duration: 92,
		reward: 181,
		title: "fugiat ea qui incididunt elit veniam dolore",
		answers: [],
		author: {
			id: initiatorId,
			joined_date: 27778232,
			name: "Initiator",
		},
		status: "CLOSED",
		status_end_date: 27778452,
		status_update_date: 27778422,
		winner: null,
		close_transaction_block_height: 75,
	},
	hasData: true,
	answers: [],
};

export const CLOSED_ANSWER = {
	question: {
		author_invoice: {
			buyer,
			id: "y6do4v-v3yvs-4e4a5-tc6vd-b5uwj-v4dgx-d7blm-jezte-3faa",
		},
		content:
			"Officia sit consectetur occaecat sint. Laboris labore ipsum cupidatat minim quis commodo deserunt aliqua aliquip duis est.",
		creation_date: 27778416,
		id: "37jwjf-ssrpo-xtfb5-wpxna-tbase-qf2xn-a66uf-6svfl-3c2y",
		open_duration: 92,
		reward: 181,
		title: "fugiat ea qui incididunt elit veniam dolore",
		answers: [
			{
				author: {
					id: answerer,
				},
				id: "iy4vop-xbqcu-pfzg4-5jfau-ccq5m-gyrqu-wmaiz-j5ftz-rpw6",
			},
			{
				author: {
					id: answerer2,
				},
				id: "aaaaa-xbqcu-pfzg4-5jfau-ccq5m-gyrqu-wmaiz-j5ftz-rpw6",
			},
		],
		author: {
			id: initiatorId,
			joined_date: 27778232,
			name: "Initiator",
		},
		status: "CLOSED",
		status_end_date: 27778452,
		status_update_date: 27778422,
		winner: {
			author: {
				id: answerer,
				joined_date: 27778217,
				name: "Answerer",
			},
			content:
				"Eu veniam consectetur dolor amet do Lorem aliqua cillum. Culpa et veniam quis enim velit. Aute eu duis ut aliqua sint amet.",
			creation_date: 27778423,
			id: "iy4vop-xbqcu-pfzg4-5jfau-ccq5m-gyrqu-wmaiz-j5ftz-rpw6",
		},
		close_transaction_block_height: 75,
	},
	hasData: true,
	answers: [
		{
			author: {
				id: answerer,
				joined_date: 27778217,
				name: "Answerer",
			},
			content:
				"Eu veniam consectetur dolor amet do Lorem aliqua cillum. Culpa et veniam quis enim velit. Aute eu duis ut aliqua sint amet.",
			creation_date: 27778423,
			id: "iy4vop-xbqcu-pfzg4-5jfau-ccq5m-gyrqu-wmaiz-j5ftz-rpw6",
		},
		{
			author: {
				id: answerer2,
				joined_date: 27778217,
				name: "Answerer 2",
			},
			content:
				"Eu veniam consectetur dolor amet do Lorem aliqua cillum. Culpa et veniam quis enim velit. Aute eu duis ut aliqua sint amet.",
			creation_date: 27778423,
			id: "aaaaa-xbqcu-pfzg4-5jfau-ccq5m-gyrqu-wmaiz-j5ftz-rpw6",
		},
	],
};
