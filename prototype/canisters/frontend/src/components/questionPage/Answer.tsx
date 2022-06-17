import { useEffect, useState } from "react";
import CallStateHandler from "../helperComponents/CallStateHandler";
import { graphQlToStrDate } from "../../utils/conversions";

const Answer = ({
	answer,
	questionState,
	handlePickWinner,
	plug,
	callState,
	cachedAvatars,
	loadAvatar
}: any) => {
	var border = "";
	
	const visualiseWinner = () => {
		if (
			!questionState.question.winner ||
			!questionState.question.winner.id ||
			!answer.id
		) {
			return;
		}
		if (questionState.question.status === "DISPUTABLE") {
			if (answer.id === questionState.question.winner.id) {
				border = "border border-yellow-500 border";
			}
		} else if (questionState.question.status === "CLOSED") {
			if (answer.id === questionState.question.winner.id) {
				border = "border border-green-500 border";
			}
		}
	};
	visualiseWinner();

	// Make sure to load all the avatars for this question
	useEffect(() => {
		loadAvatar(answer.author.id);
	}, []);

	const pickWinner = (
		<>
			{questionState.question.status === "PICKANSWER" &&
			plug.isConnected &&
			plug.plug.principalId === questionState.question.author.id ? (
				<>
					<div className="flex justify-end w-full">
						<div>
							<button
								className="bg-secondary hover:bg-primary my-button mb-2 mt-2"
								onClick={(e) => handlePickWinner(e, answer.id)}
							>
								Pick Winner
							</button>

							<CallStateHandler
								loading={callState.loading}
								err={callState.err}
								errMsg={"Something went wrong"}
							/>
						</div>
					</div>
				</>
			) : (
				<></>
			)}
		</>
	);

	const answerContent = (
		<>
			<div className="flex flex-row">
				<div className="w-20">
					<img className="w-10 h-10 rounded-full" src={cachedAvatars.get(answer.author.id)} alt=""/>
				</div>
				<div className="flex flex-col grow">
					<div className="pb-4">
						<div className="flex justify-between pb-2">
							<div className="font-medium">
								{answer.author.name}
							</div>
							<div className="small-text">
								{graphQlToStrDate(answer.creation_date)}
							</div>
						</div>
						<p className="text-left font-light"> {answer.content}</p>
					</div>
				</div>
			</div>
		</>
	);

	return (
		<div className={`p-16 pr-10 pt-5 pb-5 bg-primary mb-4 min-h-24 ${border}`}>
			{answerContent}
			{pickWinner}
		</div>
	);
};

export default Answer;
