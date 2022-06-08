import { Link } from "react-router-dom";
import { useState } from "react";
import { toHHMMSS } from "../utils/conversions";
import { questionStatusToString, graphQlToJsDate } from "../utils/conversions";

const Question = ({ question }: any) => {
	const [countdown, setCountdown] = useState<any>();

	let deadline = (question.creation_date + question.open_duration) * 60 * 1000;
	setTimeout(() => {
		let secondsRemaing = (deadline - Date.now()) / 1000;
		if (secondsRemaing > 0) {
			setCountdown(secondsRemaing);
		} else {
			setCountdown(null);
		}
	}, 1000);

	if (Object.keys(question).length === 0) {
		return <div>No question</div>;
	}
	return (
		<div className="pl-16 pr-10 pt-10 pb-10 border-b-2 border-secondary bg-primary">
			<div className="pb-4">
				<div className="flex justify-between">
					{/*   OWNER + CREATED_AT  DIV */}
					<div className="small-text">
						Submitted by{" "}
						<p className="no-underline hover:underline inline-block">user </p>{" "}
						at{" "}
						{graphQlToJsDate(question.creation_date).toLocaleString(undefined, {
							hour: "numeric",
							minute: "numeric",
							month: "long",
							day: "numeric",
						})}
					</div>

					{/*   STATUS DIV   */}
					<div className="small-text">
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
			<Link to={`/question/${question.id}`}>
				<div className="flex items-center justify-between mr-5 font-light ">
					<div className="flex">
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
					{/* COUNTDOWN DIV */}
					<div className="flex justify-end">
						{countdown > 0 && question.status === "OPEN" ? (
							<div className="text-justify font-light">
								Deadline: {toHHMMSS(countdown)}
							</div>
						) : (
							<div></div>
						)}
					</div>
				</div>
			</Link>
		</div>
	);
};

export default Question;
