import { useState } from "react";
import {
	questionStatusToString,
	graphQlToJsDate,
	toHHMMSS,
} from "../../utils/conversions";

const Body = ({ questionState, deadline }: any) => {
	console.log(deadline, "deadline");
	const [countdown, setCountdown] = useState<any>("");

	setTimeout(() => {
		let secondsRemaing = (deadline - Date.now()) / 1000;
		if (secondsRemaing > 0) {
			setCountdown(toHHMMSS(secondsRemaing));
		} else {
			setCountdown(null);
		}
	}, 1000);

	return (
		<div className="mb-10">
			<div className=" flex justify-between">
				{/*   OWNER + CREATED_AT  DIV */}
				<div className="flex justify-between font-light text-xs mb-1">
					Submitted at{" "}
					{graphQlToJsDate(questionState.question.creation_date).toLocaleString(
						undefined,
						{
							hour: "numeric",
							minute: "numeric",
							month: "short",
							day: "numeric",
						}
					)}{" "}
					by:{" "}
					<p className="ml-1 no-underline hover:underline inline-block">
						user{" "}
					</p>{" "}
				</div>

				{/*   STATUS DIV   */}
				<div className=" font-light text-xs mb-1">
					Status: {questionStatusToString(questionState.question.status)}
				</div>
			</div>

			{/*   CONTENT DIV   */}
			<div className="mb-8 ">
				<div className="font-light text-2xl mb-2 ">
					{questionState.question.title}
				</div>
				<p className="text-justify font-light">
					{questionState.question.content}
				</p>
			</div>
			<div className="flex justify-between">
				{/*   REWARD DIV   */}

				<div className="flex  mr-5 font-light">
					Reward:{" "}
					{Math.round(Number(questionState.question.reward) * 10000) / 10000}{" "}
					ICP
				</div>

				{/*   DEADLINE DIV   */}
				<div className="mb-2 ">
					{" "}
					{countdown < 0 ? (
						<div className="text-justify font-light">
							{" "}
							Deadline: {countdown}
						</div>
					) : (
						<div></div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Body;
