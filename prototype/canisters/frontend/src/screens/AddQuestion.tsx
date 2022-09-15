import { useEffect, useState } from "react";

import ListWrapper from "../components/core/view/ListWrapper";
import TitleBar from "../components/addQuestion/view/TitleBar";
import SlateEditor from "../components/addQuestion/view/SlateEditor";
import ButtonSmall from "../components/core/view/ButtonSmall";

import plugApi from "../components/core/services/plug";
import { icpToE8s } from "../components/core/services/utils/conversions";
import { Principal } from "@dfinity/principal";

const AddQuestion = ({ isConnected, createInvoice, transfer, askQuestion }) => {
	const [titleSpecification, setTitleSpecification] = useState({
		title: "Add your title here...",
		minTitle: 20,
		maxTitle: 300,
	});
	const [durationSpecification, setDurationSpecification] = useState<any>({
		duration: 60,
		minDuration: 60,
		maxDuration: 7200,
	});
	const [rewardSpecification, setRewardSpecification] = useState<any>({
		reward: 0,
		minReward: 0,
		maxReward: 500,
	});

	const [content, setContent] = useState("");
	const [isValidated, setIsValidated] = useState(false);

	const isBetweenMinMax = (value, min, max) => {
		return value >= min && value <= max;
	};

	useEffect(() => {
		if (
			titleSpecification.minTitle <= titleSpecification.title.length &&
			titleSpecification.title.length <= titleSpecification.maxTitle &&
			durationSpecification.duration >= durationSpecification.minDuration &&
			durationSpecification.maxDuration >= durationSpecification.duration &&
			rewardSpecification.reward >= rewardSpecification.minReward &&
			rewardSpecification.maxReward >= rewardSpecification.reward
		) {
			setIsValidated(true);
		} else {
			setIsValidated(false);
		}
	}, [titleSpecification, durationSpecification, rewardSpecification]);

	// TODO: round number if ICP
	const submit = async () => {
		if (!isValidated) {
			return;
		}

		// TODO: Structure of app is confusing if that is imported from plug directly
		if (!(await plugApi.verifyConnection())) {
			return;
		}
		// TODO: Add error handling
		try {
			// 1. Create the invoice
			const invoiceResponse = await createInvoice(
				icpToE8s(rewardSpecification.reward)
			);
			console.log(invoiceResponse, "invoice response");
			// 2. Perform the transfer
			const transferResponse = await transfer({
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
			console.log(transferResponse, "transfer response");
			if (transferResponse?.Err !== undefined) {
				if (transferResponse?.Err?.InsufficientFunds !== undefined) {
				} else {
				}
				return;
			}

			// 3. Create the question
			const openQuestionResponse = await askQuestion(
				invoiceResponse.ok.invoice.id,
				durationSpecification.duration,
				titleSpecification.title,
				content
			);
			console.log(openQuestionResponse, "openQuestionResponse");

			if (openQuestionResponse.err) {
				console.error(
					"market canister ask_question call returned the error: " +
						openQuestionResponse.err
				);

				return;
			}

			setTitleSpecification({ ...titleSpecification, title: "" });
			setDurationSpecification({ ...durationSpecification, duration: 0 });
			setRewardSpecification({ ...rewardSpecification, reward: 0 });
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
				duration={durationSpecification.duration}
				setDuration={(newDuration) => {
					setDurationSpecification({
						...durationSpecification,
						duration: newDuration,
					});
				}}
				isDurationError={
					!isBetweenMinMax(
						durationSpecification.duration,
						durationSpecification.minDuration,
						durationSpecification.maxDuration
					)
				}
				minDuration={durationSpecification.minDuration}
				maxDuration={durationSpecification.maxDuration}
				reward={rewardSpecification.reward}
				setReward={(newReward) => {
					setRewardSpecification({
						...rewardSpecification,
						reward: newReward,
					});
				}}
				isRewardError={
					!isBetweenMinMax(
						rewardSpecification.reward,
						rewardSpecification.minReward,
						rewardSpecification.maxReward
					)
				}
				minReward={rewardSpecification.minReward}
				maxReward={rewardSpecification.maxReward}
				title={titleSpecification.title}
				setTitle={(newTitle) =>
					setTitleSpecification({
						...titleSpecification,
						title: newTitle,
					})
				}
				isTitleError={
					!isBetweenMinMax(
						titleSpecification.title.length,
						titleSpecification.minTitle,
						titleSpecification.maxTitle
					)
				}
				minTitle={titleSpecification.minTitle}
				maxTitle={titleSpecification.maxTitle}
			/>
			<SlateEditor inputValue={content} setInputValue={setContent} />

			{isConnected ? (
				<>
					{isValidated ? (
						<div>
							<ButtonSmall
								propFunction={submit}
								text={"Submit"}
								font={""}
								loading={true}
							/>
						</div>
					) : (
						<div className="heading3-18px">Fill out the form correctly</div>
					)}
				</>
			) : (
				<div className="heading3-18px"> Login to Submit</div>
			)}
		</ListWrapper>
	);
};

export default AddQuestion;
