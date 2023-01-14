import React, { useContext } from "react";
import { useState, useEffect } from "react";
import Button from "../core/Button";
import { Principal } from "@dfinity/principal";
import { SubmitStages, SubmitStagesText } from "./SubmitStages";
import { Mail } from "../../components/addQuestion/mail";
import { ActorContext } from "../api/Context";

// TODO: should this not just reset by itself?
// TODO: replace with (possibly) useRender. Only that state of submitStages resets on parent rerender
/* useEffect(() => {
		setSubmitStages("");
	}, [userPrincipal, create_invoice, transfer, ask_question]); */

type SubmitStages =
	| ""
	| "invoice"
	| "transfer"
	| "submit"
	| "success"
	| "error";

const Submit = ({ inputs }) => {
	const [submitStages, setSubmitStages] = useState<SubmitStages>("");
	// --------------------  Context --------------------
	const { user } = useContext(ActorContext);

	const submit = async () => {
		try {
			// ------- create the invoice -------
			setSubmitStages("invoice");

			const invoice_res = await user.market.create_invoice(inputs.reward);
			if ("err" in invoice_res) {
				setSubmitStages("error");
				return;
			}
			console.log(invoice_res, "invoice_res");

			// -------  transfer -------
			setSubmitStages("transfer");
			const transfer_res = await user.ledger.transfer({
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
			if (transfer_res?.Err !== undefined) {
				setSubmitStages("error");
				return;
			}
			console.log(transfer_res, "transfer response");

			// -------  create the question ------
			setSubmitStages("submit");
			const question_res = await user.market.ask_question(
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
			<Button
				propFunction={submit}
				text={"Submit"}
				CustomLoader={() => {
					return <SubmitStages stages={submitStages} />;
				}}
			/>
			<SubmitStagesText stages={submitStages} />
		</div>
	);
};

export default Submit;
