import { useState } from "react";

import plugApi from "../api/plug";
import { Principal } from "@dfinity/principal";
import Loading from "./helperComponents/Loading";
import deepcopy from "deepcopy";
import { e3sToIcp, icpToE3s } from "../utils/conversions";

import SlateEditor from "./SlateEditor";

function AddQuestion({ plug, minReward }: any) {
	const [title, setTitle] = useState<any>("");
	const [inputValue, setInputValue] = useState("");
	const [duration, setDuration] = useState<any>("");
	const [reward, setReward] = useState<any>("0");

	const [errors, setErrors] = useState<any>({
		minRewardErr: false,
		minRewardErrMsg: `Please use a reward larger than ${e3sToIcp(
			minReward
		)} ICP`,
		minDurationErr: false,
		minDurationErrMsg: "Please use a positive value",
		minTitleCharactersErr: false,
		minTitleCharactersErrMsg: "Title has to be longer than 20 characters",
	});

	const formValidation = () => {
		var correctReward = false;
		var negativeDuration = false;
		var minTitleCharacters = false;

		if (Number(icpToE3s(reward)) < minReward) {
			correctReward = true;
		}
		if (duration <= 0) {
			negativeDuration = true;
		}

		if (title.length <= 20) {
			minTitleCharacters = true;
		}

		var newErrors = deepcopy(errors);
		newErrors.minRewardErr = correctReward;
		newErrors.minDurationErr = negativeDuration;
		newErrors.minTitleCharactersErr = minTitleCharacters;

		setErrors(newErrors);
		if (!correctReward && !negativeDuration && !minTitleCharacters) {
			return true;
		}
	};

	// TO DO: Has to be improved with security in mind
	// TO DO: Error handling
	const handleSubmit = async (e: any) => {
		e.preventDefault();

		if (!formValidation()) {
			return;
		}

		if (!(await plugApi.verifyConnection())) {
			return;
		}

		try {
			console.log(
				"reward:",
				reward,
				"title:",
				title,
				"duration:",
				duration,
				"input:",
				inputValue
			);

			const invoiceResponse = await plug.actors.marketActor.create_invoice(
				BigInt(Number(reward))
			);
			// if not ok return error
			console.log(invoiceResponse);

			// (TO DO: shows invoice to pay with plug)
			// pays invoice with plug on the ledger

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
				amount: { e8s: invoiceResponse.ok.invoice.amount + BigInt(10000000) },
			});

			// if not ok return error
			console.log(transferResponse);

			// once paid calls open question function it
			const openQuestionResponse = await plug.actors.marketActor.ask_question(
				invoiceResponse.ok.invoice.id,
				Number(duration),
				title,
				inputValue
			);

			console.log(openQuestionResponse);
		} catch (e) {
			console.log(e);
		}
	};

	const form = (
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
					<div className=" text-red-600 mt-2 text-xs">
						{errors.minDurationErr ? (
							<div className=" text-red-600 mt-2 text-xs">
								{errors.minDurationErrMsg}
							</div>
						) : (
							<></>
						)}
					</div>
				</div>

				<div className="mb-10 ml-4 text-center w-full">
					Reward:
					<input
						type="number"
						value={reward}
						onChange={(e) => {
							setReward(e.target.value);
						}}
						className=" bg-primary border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  w-full p-2.5 "
					/>
					{errors.minRewardErr ? (
						<div className=" text-red-600 mt-2 text-xs">
							{errors.minRewardErrMsg}
						</div>
					) : (
						<></>
					)}
				</div>
			</div>
			<div className="mb-10 text-center ">
				Title:
				<input
					type="text"
					value={title}
					onChange={(e) => {
						setTitle(e.target.value);
					}}
					className=" bg-primary border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
				/>
				{errors.minTitleCharactersErr ? (
					<div className=" text-red-600 mt-2 text-xs">
						{errors.minTitleCharactersErrMsg}
					</div>
				) : (
					<></>
				)}
			</div>
			<div className="mb-6 ">
				<SlateEditor inputValue={inputValue} setInputValue={setInputValue} />
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
	);

	return (
		<>
			<div className="mb-10">{form} </div>
		</>
	);
}

// {minReward ? form : <Loading />}

export default AddQuestion;
