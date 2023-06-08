import { Principal } from "@dfinity/principal";
import Mail from "../core/Mail";
import { icpToE8s } from "../core/utils/conversions";

export const createInvoice = async (loggedInUser, inputs) => {
	console.log("createInvoice hit");
	const res = await loggedInUser.market.create_invoice(icpToE8s(inputs.reward));

	console.log("createInvoice res", res);

	if ("Err" in res) {
		throw new Error(`Error: ${res}`);
	} else {
		console.log(res.ok);
		return res.ok;
	}
};

export const transfer = async (loggedInUser, invoice) => {
	const res = await loggedInUser.ledger.transfer({
		to: invoice.destination,
		fee: { e8s: BigInt(10000) },
		memo: BigInt(0),
		from_subaccount: [],
		created_at_time: [],
		amount: { e8s: BigInt(invoice.amount) },
	});
	console.log("transfer res", res);

	if ("Err" in res) {
		throw new Error(`Error: ${res}`);
	} else {
		return res;
	}
};

export const createQuestion = async (loggedInUser, invoiceId, inputs) => {
	const res = await loggedInUser.market.ask_question(
		invoiceId,
		inputs.duration * 60,
		inputs.title,
		inputs.content
	);
	console.log("createQuestion res", res);

	if ("Err" in res) {
		throw new Error(`Error: ${res}`);
	} else {
		Mail("New Question");
		window.location.href = "#/question/" + res.ok.id;
		return res;
	}
};
