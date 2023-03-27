import React from "react";
import { useState, useEffect } from "react";
import { StagesButton } from "../core/Button";
import { Principal } from "@dfinity/principal";
import { SubmitStages, SubmitStagesText } from "./SubmitStages";
import Mail from "../core/Mail";
import { icpToE8s } from "../core/utils/conversions";
import { IInputs } from "../../screens/AddQuestion";
import { ILoggedInUser } from "../api/Context";
// TODO: Entire component should return the specific error.
// Only transfer error should happen I think.

// TODO: should this not just reset by itself?
// TODO: replace with (possibly) useRender. Only that state of submitStages resets on parent rerender
/* useEffect(() => {
		setSubmitStages("");
	}, [userPrincipal, create_invoice, transfer, ask_question]); */

// TODO: ensures that only logged in users can call this func
// could I instead make this a func on the logged in user?
// but that would mess with the setStages but think about it
interface ISubmit {
	inputs: IInputs;
	loggedInUser: ILoggedInUser;
}
const Submit = ({ inputs, loggedInUser }: ISubmit) => {
	const [submitStages, setSubmitStages] = useState<SubmitStages>("");

	// TODO: I have to check for it because I import the actor from useContext.

	const submit = async () => {
		try {
			// ------- create the invoice -------
			setSubmitStages("invoice");

			const invoice_res = await loggedInUser.market.create_invoice(
				icpToE8s(inputs.reward)
			);
			console.log(invoice_res, "invoice");
			if ("err" in invoice_res) {
				setSubmitStages("error");
				return;
			}

			// -------  transfer -------
			setSubmitStages("transfer");
			// TODO: assert that it's type text on the invoice res
			// TODO: check what is wrong with "to"
			const transfer_res = await loggedInUser.ledger.transfer({
				to: Array.from(
					Principal.fromHex(
						invoice_res.ok.invoice.destination.text
					).toUint8Array()
				),
				fee: { e8s: BigInt(10000) },
				memo: BigInt(0),
				from_subaccount: [],
				created_at_time: [],
				amount: { e8s: BigInt(invoice_res.ok.invoice.amount) },
			});
			console.log(transfer_res, "transfer");

			if ("Err" in transfer_res) {
				setSubmitStages("error");
				return;
			}

			// -------  create the question ------
			setSubmitStages("submit");
			const question_res = await loggedInUser.market.ask_question(
				invoice_res.ok.invoice.id,
				inputs.duration,
				inputs.title,
				inputs.content
			);
			console.log(question_res, "openQuestionResponse");

			if ("err" in question_res) {
				setSubmitStages("error");
				return;
			}
			Mail("New Question");
			window.location.href = "#/question/" + question_res.ok.id;

			return;
		} catch (e) {
			setSubmitStages("error");
			console.debug(e);
		}
	};

	return (
		<div className="flex items-center">
			<StagesButton
				propFunction={submit}
				text={"Submit"}
				customLoader={() => {
					return <SubmitStages stages={submitStages} />;
				}}
			/>
			<SubmitStagesText stages={submitStages} />
		</div>
	);
};

export default Submit;
