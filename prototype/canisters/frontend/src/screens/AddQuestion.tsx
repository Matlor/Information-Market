import { useState } from "react";

import ListWrapper from "../components/core/view/ListWrapper";
import TitleBar from "../components/addQuestion/view/TitleBar";
import SlateEditor from "../components/addQuestion/view/SlateEditor";
import ButtonSmall from "../components/core/view/ButtonSmall";

import plugApi from "../components/core/services/plug";
import { icpToE8s } from "../components/core/services/utils/conversions";
import { Principal } from "@dfinity/principal";

const AddQuestion = ({ plug }) => {
	const [title, setTitle] = useState("");
	const [duration, setDuration] = useState("");
	const [reward, setReward] = useState(0);
	const [content, setContent] = useState("");

	const submit = async () => {
		// TO DO: Structure of app is confusing if that is imported from plug directly
		if (!(await plugApi.verifyConnection())) {
			return;
		}

		try {
			// 1. Create the invoice
			const invoiceResponse = await plug.actors.marketActor.create_invoice(
				icpToE8s(reward)
			);
			console.log(invoiceResponse, "invoice response");
			// 2. Perform the transfer
			const transferResponse = await plug.actors.ledgerActor.transfer({
				to: Array.from(
					Principal.fromHex(
						invoiceResponse.ok.invoice.destination.text
					).toUint8Array()
				),
				fee: { e8s: BigInt(10000) },
				memo: BigInt(0),
				from_subaccount: [],
				created_at_time: [],
				amount: { e8s: invoiceResponse.ok.invoice.amount },
			});

			if (transferResponse?.Err !== undefined) {
				if (transferResponse?.Err?.InsufficientFunds !== undefined) {
				} else {
				}
				return;
			}
			// 3. Create the question
			const openQuestionResponse = await plug.actors.marketActor.ask_question(
				invoiceResponse.ok.invoice.id,
				duration,
				title,
				content
			);

			if (openQuestionResponse.err) {
				console.error(
					"market canister ask_question call returned the error: " +
						openQuestionResponse.err
				);

				return;
			}

			setTitle("");
			setDuration("");
			setReward(0);
			setContent("");

			// Success! Redirect to question page
			window.location.href = "#/question/" + openQuestionResponse.ok.id;
		} catch (e) {
		} finally {
		}
	};

	return (
		<ListWrapper>
			<TitleBar
				title={title}
				setTitle={setTitle}
				duration={duration}
				setDuration={setDuration}
				reward={reward}
				setReward={setReward}
			/>
			<SlateEditor inputValue={content} setInputValue={setContent} />

			{plug.isConnected ? (
				<div>
					<ButtonSmall propFunction={submit} text={"Submit"} />
				</div>
			) : (
				<div className="heading3-18px"> Login to Submit</div>
			)}
		</ListWrapper>
	);
};

export default AddQuestion;
