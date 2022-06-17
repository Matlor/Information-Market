import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { e3sToIcp, jsToGraphQlDate, toHHMM } from "../utils/conversions";
import { questionStatusToString } from "../utils/conversions";
import SubmittedBy from "./helperComponents/SubmittedBy";
import parse from "html-react-parser";

const Question = ({ question, cachedAvatars, loadAvatars }: any) => {
	const [timeLeft, setTimeLeft] = useState<string>(
		toHHMM(question.status_end_date - jsToGraphQlDate(Date.now()))
	);

	// Make sure to load all the avatars for this question
	useEffect(() => {
		loadAvatars([question]);
	}, []);

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
					<img className="w-10 h-10 rounded-full" src={cachedAvatars.get(question.author.id)} alt=""/>

					{/*   STATUS DIV   */}
					<div className="small-text">
						{" "}
						Status: {questionStatusToString(question.status)}
					</div>
				</div>

				<div className="font-medium text-xl mb-2 text-slate-500">
					<Link to={`/question/${question.id}`}>{question.title}</Link>
				</div>
				<div className="editor-wrapper">{parse(question.content)}</div>
			</div>

			{/*   REWARD DIV   */}
			<Link to={`/question/${question.id}`}>
				<div className="flex items-center justify-between font-light ">
					<div className="flex">{e3sToIcp(Number(question.reward))} ICP</div>
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
