import { useState } from "react";

import plugApi from "../api/plug";
import { Principal } from "@dfinity/principal";

function Landing({ plug }: any) {
	const [title, setTitle] = useState<any>("");
	const [content, setContent] = useState<string>("");
	const [duration, setDuration] = useState<any>(0);
	const [reward, setReward] = useState<any>("0");

	// TO DO: Has to be improved with security in mind
	const handleSubmit = async (e: any) => {
		e.preventDefault();

		if (!(await plugApi.verifyConnection())) {
			return;
		}

		const invoiceResponse = await plug.actors.marketActor.create_invoice(
			BigInt(parseInt(reward))
		);
		console.log(invoiceResponse.ok.invoice);
		// TO DO: check for errors

		// (TO DO: shows invoice to pay with plug)
		// pays invoice with plug on the ledger
		console.log(
			await plug.actors.ledgerActor.transfer({
				to: Array.from(
					Principal.fromHex(
						invoiceResponse.ok.invoice.destination.text
					).toUint8Array()
				),
				fee: { e8s: BigInt(10000) },
				memo: BigInt(0),
				from_subaccount: [],
				created_at_time: [],
				amount: { e8s: invoiceResponse.ok.invoice.amount + BigInt(10000000) },
			})
		);

		// once paid calls open question function it
		const openQuestionResponse = await plug.actors.marketActor.ask_question(
			invoiceResponse.ok.invoice.id,
			parseInt(duration),
			title,
			content
		);

		console.log(openQuestionResponse);
	};
	return (
		<>
			{" "}
			<>
				<div className="mb-10">
					<h1 className="text-2xl  mr-4 font-medium "> Ask a Question</h1>
				</div>

				<form onSubmit={handleSubmit}>
					<div className="flex justify-between">
						<div className="mb-6 mr-4 text-center w-full">
							Duration:
							<input
								type="number"
								value={duration}
								onChange={(e) => {
									setDuration(e.target.value);
								}}
								className=" bg-primary border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  w-full  p-2.5 "
							/>
						</div>

						<div className="mb-6 ml-4 text-center w-full">
							Reward:
							<input
								type="number"
								value={reward}
								onChange={(e) => {
									setReward(e.target.value);
								}}
								className=" bg-primary border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  w-full p-2.5 "
							/>
						</div>
					</div>
					<div className="mb-6 text-center ">
						Title:
						<input
							type="text"
							value={title}
							onChange={(e) => {
								setTitle(e.target.value);
							}}
							className=" bg-primary border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
						/>
					</div>
					<div className="mb-6 text-center">
						Content:
						<textarea
							value={content}
							onChange={(e) => {
								setContent(e.target.value);
							}}
							className=" h-40 bg-primary border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
						/>
					</div>

					{plug.isConnected ? (
						<div className="flex justify-center">
							<button type="submit" className="my-button ">
								Submit
							</button>
						</div>
					) : (
						<div className="text-center">Please log in first</div>
					)}
				</form>
			</>
		</>
	);
}

export default Landing;
