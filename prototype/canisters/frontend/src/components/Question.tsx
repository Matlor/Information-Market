import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { e3sToIcp, jsToGraphQlDate, toHHMM } from "../utils/conversions";

import { questionStatusToString } from "../utils/conversions";
import SubmittedBy from "./helperComponents/SubmittedBy";

const Question = ({ question }: any) => {
	const [timeLeft, setTimeLeft] = useState<string>(
		toHHMM(question.status_end_date - jsToGraphQlDate(Date.now()))
	);

	useEffect(() => {
		const interval = setInterval(() => {
			setTimeLeft(
				toHHMM(question.status_end_date - jsToGraphQlDate(Date.now()))
			);
		}, 1000);
		return () => clearInterval(interval);
	}, [timeLeft]);

	if (Object.keys(question).length === 0) {
		return <div>No question</div>;
	}
	return (
		<div className="pl-16 pr-10 pt-10 pb-10 border-b-2 border-secondary bg-primary">
			<div className="pb-4">
				<div className="flex justify-between">
					{/*   OWNER + CREATED_AT  DIV */}
					<SubmittedBy
						author={question.author.name}
						creation_date={question.creation_date}
					/>

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
				<div className="flex items-center justify-between font-light ">
					<div className="flex">
						{e3sToIcp(Number(question.reward))} ICP
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
					<div className="mb-2 ">
						{" "}
						<div className="text-justify font-light">
							{" "}
							Time left: {timeLeft}
						</div>
					</div>
				</div>
			</Link>
		</div>
	);
};

export default Question;
