import { Link } from "react-router-dom";
import { useState } from "react";
import { toHHMMSS } from "../utils/conversions";

import { questionStatusToString, graphQlToJsDate } from "../utils/conversions";

const Question = ({ question, deadline }: any) => {
	const [countdown, setCountdown] = useState<any>(0);

	setTimeout(() => {
		let secondsRemaing = (deadline - Date.now()) / 1000;
		if (secondsRemaing > 0) {
			setCountdown(secondsRemaing);
		} else {
			setCountdown(null);
		}
	}, 1000);

	const showQuestion = (question: any) => {
		if (Object.keys(question).length !== 0) {
			return (
				<>
					<div className=" pb-4">
						<div className="flex justify-between">
							{/*   OWNER + CREATED_AT  DIV */}
							<div className="font-light text-xs mb-2">
								Submitted by{" "}
								<p className="no-underline hover:underline inline-block">
									user{" "}
								</p>{" "}
								at{" "}
								{graphQlToJsDate(question.creation_date).toLocaleString(
									undefined,
									{
										hour: "numeric",
										minute: "numeric",
										month: "long",
										day: "numeric",
									}
								)}
							</div>
							{/*   STATUS DIV   */}
							<div className="font-light text-xs mb-1">
								{" "}
								Status: {questionStatusToString(question.status)}
							</div>
						</div>

						<div className="font-medium text-xl mb-2 text-slate-500">
							<Link to={`/question/${question.id}`}>{question.title}</Link>
						</div>
						<p className="text-justify font-light  "> {question.content}</p>
					</div>
					{/*   REWARD DIV   */}
					<div className="flex  items-center">
						<Link to={`/question/${question.id}`}>
							<div className="flex items-center mr-5 font-light ">
								{Math.round(Number(question.reward) * 10000) / 10000} ICP
								<svg
									className="w-4 h-4 ml-2"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth="2"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M5 12h14"></path>
									<path d="M12 5l7 7-7 7"></path>
								</svg>
							</div>
						</Link>
					</div>
					{/* COUNTDOWN DIV */}
					<div className="mb-2 ">
						{" "}
						{countdown > 0 && question.status === "OPEN" ? (
							<div className="text-justify font-light">
								{" "}
								Deadline: {toHHMMSS(countdown)}
							</div>
						) : (
							<div></div>
						)}
					</div>
				</>
			);
		} else {
			return <div>No question</div>;
		}
	};
	//

	return (
		<div className=" pl-16 pr-10 pt-10 pb-10  border-b-2 border-secondary bg-primary mb-4">
			{showQuestion(question)}
		</div>
	);
};

export default Question;
