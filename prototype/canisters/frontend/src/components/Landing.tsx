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
			content
		);

		console.log(openQuestionResponse);
	};
	return (
		<>
			{" "}
			<div className="border p-10  m-20 text-center">
				<div className="mb-10">
					<h1 className="text-3xl font-bold mr-4 text-slate-700">
						{" "}
						Ask a Question
					</h1>
				</div>

				<div className="flex justify-center ">
					<form onSubmit={handleSubmit}>
						<div className="mb-6 text-center">
							Title:
							<input
								type="text"
								value={title}
								onChange={(e) => {
									setTitle(e.target.value);
								}}
								className="w-72 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
							/>
						</div>
						<div className="mb-6 text-center">
							Content:
							<input
								type="text"
								value={content}
								onChange={(e) => {
									setContent(e.target.value);
								}}
								className="w-72 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
							/>
						</div>

						<div className="mb-6 text-center">
							Duration:
							<input
								type="number"
								value={duration}
								onChange={(e) => {
									setDuration(e.target.value);
								}}
								className=" w-72 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
							/>
						</div>

						<div className="mb-6 text-center">
							Reward:
							<input
								type="number"
								value={reward}
								onChange={(e) => {
									setReward(e.target.value);
								}}
								className="w-72 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
							/>
						</div>

						{plug.isConnected ? (
							<button
								type="submit"
								className="text-white bg-slate-400 hover:bg-slate-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
							>
								Submit
							</button>
						) : (
							<div>Please log in first</div>
						)}
					</form>
				</div>
			</div>
		</>
	);
}

export default Landing;
