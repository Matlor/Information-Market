import Loading from "./helperComponents/Loading";
import SlateEditor from "./SlateEditor";
import { icpToE8s } from "../utils/conversions";

import { useState, useEffect } from "react";
import plugApi from "../api/plug";
import { Principal } from "@dfinity/principal";

function AddQuestion({ plug, minRewardIcp, login, minTitleCharacters }: any) {

	const [rewardIcp, setRewardIcp] = useState<number>(1);
	const [minRewardErr, setMinRewardErr] = useState<boolean>(false);
	const [title, setTitle] = useState<string>("");
	const [minTitleCharactersErr, setMinTitleCharactersErr] = useState<boolean>(false);
	const [duration, setDuration] = useState<number>(60);
	const [minDurationErr, setMinDurationErr] = useState<boolean>(false);
	const [content, setContent] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	// TODO: one shall be able to distinguish if create_invoice, transfer, or create_question failed
	// and hence have 3 different kinds of errors
	const [insufficientFundsErr, setInsufficientFundsErr] = useState<boolean>(false);
	const [otherError, setOtherError] = useState<boolean>(false);

	useEffect(()=>{
		setMinRewardErr(rewardIcp < minRewardIcp);
	}, [rewardIcp]);

	useEffect(()=>{
		setMinTitleCharactersErr(title.length <= minTitleCharacters);
	}, [title]);

	useEffect(()=>{
		setMinDurationErr(duration <= 0);
	}, [duration]);

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		if (!(await plugApi.verifyConnection())) {
			return;
		}
		try {
			setLoading(true);
			// Refresh insufficient funds error
			setInsufficientFundsErr(false);
			setOtherError(false);
			// 1. Create the invoice
			const invoiceResponse = await plug.actors.marketActor.create_invoice(
				icpToE8s(rewardIcp)
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
			console.log(transferResponse);
			if (transferResponse?.Err !== undefined){
				if (transferResponse?.Err?.InsufficientFunds !== undefined) {
					setInsufficientFundsErr(true);
				} else {
					setOtherError(true);
				};
				return;
			}
			// 3. Create the question
			const openQuestionResponse = await plug.actors.marketActor.ask_question(
				invoiceResponse.ok.invoice.id,
				duration,
				title,
				content
			);
			console.log(openQuestionResponse);
			if (openQuestionResponse.err){
				console.error("market canister ask_question call returned the error: " + openQuestionResponse.err);
				setOtherError(true);
				return;
			}
			// Success! Redirect to question page
      window.location.href = "#/question/" + openQuestionResponse.ok.id;
		} catch (e) {
			setOtherError(true);
		} finally {
			setLoading(false);
		}
	};

	const loginHandler = async (e: any) => {
		e.preventDefault();
		login();
	};

	const submissionState = () => {
		if (loading) {
			return (
				<div className="text-red-600 mt-2 text-xs">
					<Loading />
				</div>
			);
		} else if (insufficientFundsErr) {
			return (
				<div className="text-red-600 text-xs">
					Insufficient funds
				</div>
			);
		} else if (otherError) {
			return <div className="text-red-600 text-xs">{otherError}</div>;
		}
	};

	const form = (
		<form onSubmit={handleSubmit}>
			<div className="flex justify-evenly">
				<div className="flex flex-col justify-between">
					<div className="flex flex-row items-center">
						<span className=" mr-2">
							Duration:
						</span>
						<input
							type="number"
							value={duration}
							onChange={(e) => {
								setDuration(Number(e.target.value));
							}}
							step="5"
							className="p-4 w-full  text-gray-900 bg-primary focus:ring-gray-400 border-none text-center font-semibold"
						/>
						<span className=" text-left pl-2">
							minutes
						</span>
					</div>
					{minDurationErr ? (
						<div className="text-red-600 mt-2 text-xs">
							Please use a positive value
						</div>
					) : (
						<></>
					)}
				</div>
				<div className="flex flex-col justify-between">
					<div className="flex flex-row items-center">
						<span className=" mr-2">
							Reward:
						</span>
						<input
							type="number"
							value={rewardIcp}
							onChange={(e) => {setRewardIcp(e.target.value)}}
							step="0.1"
							className="p-4 w-full text-sm text-gray-900 bg-primary  focus:ring-gray-400 border-none text-center font-semibold"
						/>
						<span className=" text-left pl-2">
							ICPs
						</span>
					</div>
					{minRewardErr ? (
						<div className="text-red-600 mt-2 text-xs">
							Please use a reward larger than {minRewardIcp} ICP
						</div>
					) : (
						<></>
					)}
				</div>
			</div>
			<div className="mt-10 mb-10 text-center ">
				Title:
				<input
					type="text"
					value={title}
					onChange={(e) => {
						setTitle(e.target.value);
					}}
					className=" p-4 w-full text-sm text-gray-900 bg-primary  focus:ring-gray-400 border-none font-semibold "
				/>
				{minTitleCharactersErr ? (
					<div className="text-red-600 mt-2 text-xs">
						Title has to be longer than 20 characters
					</div>
				) : (
					<></>
				)}
			</div>
			<div className="mb-6 ">
				<SlateEditor inputValue={content} setInputValue={setContent} placeholder={"Write your question here!"} />
			</div>

			{plug.isConnected ? (
				<div className="flex justify-center">
					<div>
						<button type="submit" disabled={!plug.isConnected || minRewardErr || minTitleCharactersErr || minDurationErr} className="my-button mb-2">
							Submit
						</button>
						<div className="flex justify-center">{submissionState()}</div>
					</div>
				</div>
			) : (
				<div className="font-light flex justify-center">
					<div>
						<div className="flex justify-center">
							<button onClick={loginHandler} className="my-button mb-2">
								Log in
							</button>
						</div>
						<div className="self-center">
							{" "}
							You have to be logged in to submit{" "}
						</div>
					</div>
				</div>
			)}
		</form>
	);

	return (
		<>
			<div className="mb-14 mt-14">{form}</div>
		</>
	);
}

export default AddQuestion;
