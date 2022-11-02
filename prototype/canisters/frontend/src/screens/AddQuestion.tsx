import { useEffect, useState } from "react";
import ListWrapper from "../components/core/view/ListWrapper";
import TitleBar from "../components/addQuestion/view/TitleBar";
import SlateEditor from "../components/addQuestion/view/SlateEditor";
import Button from "../components/core/view/Button";
import plugApi from "../components/core/services/plug";
import { icpToE8s } from "../components/core/services/utils/conversions";
import { Principal } from "@dfinity/principal";
import { getMinReward } from "../components/addQuestion/services/market";
import { e8sToIcp } from "../components/core/services/utils/conversions";
import Loading from "../components/core/view/Loading";

const AddQuestion = ({ isConnected, createInvoice, transfer, askQuestion }) => {
	const titlePlaceholder = "Add your Title here...";

	const [titleSpecification, setTitleSpecification] = useState({
		title: titlePlaceholder,
		minTitle: 20,
		maxTitle: 300,
	});

	const [durationSpecification, setDurationSpecification] = useState<any>({
		duration: 0,
		minDuration: 0,
		maxDuration: 7200,
	});
	const [rewardSpecification, setRewardSpecification] = useState<any>({
		reward: 0,
		minReward: 0,
		minRewardIsFetched: false,
		maxReward: 500,
	});

	const [content, setContent] = useState("");
	const [isValidated, setIsValidated] = useState(false);

	useEffect(() => {
		(async () => {
			const fetchedMin = await getMinReward();
			setRewardSpecification({
				...rewardSpecification,
				minReward: e8sToIcp(fetchedMin),
				reward: e8sToIcp(fetchedMin),
				minRewardIsFetched: true,
			});
		})();
	}, []);

	const isBetweenMinMax = (value, min, max) => {
		return value >= min && value <= max;
	};

	useEffect(() => {
		if (
			(titleSpecification.minTitle <= titleSpecification.title.length &&
				titleSpecification.title.length <= titleSpecification.maxTitle &&
				durationSpecification.duration >= durationSpecification.minDuration &&
				durationSpecification.maxDuration >= durationSpecification.duration &&
				rewardSpecification.reward >= rewardSpecification.minReward &&
				rewardSpecification.maxReward >= rewardSpecification.reward,
			rewardSpecification.minRewardIsFetched)
		) {
			setIsValidated(true);
		} else {
			setIsValidated(false);
		}
	}, [titleSpecification, durationSpecification, rewardSpecification]);

	// TODO: round number if ICP
	const submit = async () => {
		setSubmitStagesWrapper("invoice");

		if (!isValidated) {
			setSubmitStagesWrapper("error");
			return;
		}

		// TODO: Structure of app is confusing if that is imported from plug directly
		if (!(await plugApi.verifyConnection())) {
			setSubmitStagesWrapper("error");

			return;
		}
		// TODO: Add error handling
		try {
			// 1. Create the invoice
			const invoiceResponse = await createInvoice(
				icpToE8s(rewardSpecification.reward)
			);
			setSubmitStagesWrapper("transfer");

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
			setSubmitStagesWrapper("submit");
			console.log(transferResponse, "transfer response");
			if (transferResponse?.Err !== undefined) {
				setSubmitStagesWrapper("error");
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
				setSubmitStagesWrapper("error");
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

	const [submitStages, setSubmitStages] = useState("invoice");
	const setSubmitStagesWrapper = (submitStage) => {
		if (
			submitStage === "invoice" ||
			"transfer" ||
			"submit" ||
			"success" ||
			"error"
		) {
			setSubmitStages(submitStage);
		} else throw new Error("Invalid submit stage");
	};

	const ShowSubmitStages = (props) => {
		const loaders = (styles, text) => {
			return (
				<>
					<div className="flex gap-[17px]">
						<Loading color="colorBackgroundComponents" style={styles[0]} />
						<Loading color="colorBackgroundComponents" style={styles[1]} />
						<Loading color="colorBackgroundComponents" style={styles[2]} />
					</div>
					<div className="heading3 ml-4">{text}</div>
				</>
			);
		};

		switch (props.stages) {
			case "":
				return loaders(["empty", "empty", "empty"], "");
			case "invoice":
				return loaders(["loading", "empty", "empty"], "Waiting for invoice");
			case "transfer":
				return loaders(["filled", "loading", "empty"], "Transfer Ongoing");
			case "submit":
				return loaders(["filled", "filled", "loading"], "Opening Question");
			case "success":
				return loaders(["filled", "filled", "filled"], "Success!");
			case "error":
				return loaders(["empty", "empty", "empty"], "Something went wrong");
			default:
				return loaders(["empty", "empty", "empty"], "");
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
				titlePlaceholder={titlePlaceholder}
			/>
			<SlateEditor
				inputValue={content}
				setInputValue={setContent}
				placeholder="Add your question here..."
			/>

			{isConnected ? (
				<div className="h-[48px] flex ">
					{isValidated ? (
						<Button
							propFunction={submit}
							text={"Submit"}
							CustomLoader={<ShowSubmitStages stages={submitStages} />}
						/>
					) : (
						<div className="heading3  self-center ml-6">
							Fill out the form correctly
						</div>
					)}
				</div>
			) : (
				<div className="heading3"> Login to Submit</div>
			)}
		</ListWrapper>
	);
};

export default AddQuestion;
