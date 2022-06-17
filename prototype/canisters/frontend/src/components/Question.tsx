import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { e3sToIcp, jsToGraphQlDate, toHHMM } from "../utils/conversions";

import { questionStatusToString, graphQlToStrDate } from "../utils/conversions";
import QuestionStatusBar from "./QuestionStatusBar";
import CoinStackIcon from "./questionPage/CoinStackIcon";

const timeLeftToStr = (timeLeft) => {
	if (timeLeft < 0) {
		return ''
	} else {
		return '(ends in ' + toHHMM(timeLeft) + ')';
	}
};

const Question = ({ question, cachedAvatars, loadAvatars }: any) => {
	const [timeLeft, setTimeLeft] = useState<string>(
		timeLeftToStr(question.status_end_date - jsToGraphQlDate(Date.now()))
	);

	// Make sure to load all the avatars for this question
	useEffect(() => {
		loadAvatars([question]);
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			setTimeLeft(
				timeLeftToStr(question.status_end_date - jsToGraphQlDate(Date.now()))
			);
		}, 1000);
		return () => clearInterval(interval);
	}, [timeLeft]);

	if (Object.keys(question).length === 0) {
		return <div>No question</div>;
	}
	return (
		<>
		<div className="pl-16 pb-2 font-medium text-xl mb-2 text-slate-500">
			<Link to={`/question/${question.id}`}>{question.title}</Link>
		</div>
		<div className="pl-16 pr-10 pt-5 pb-2 border-b-2 border-secondary bg-primary">
			<div className="flex flex-row">
				<div className="flex w-20">
					<img className="w-14 h-14 rounded-full" src={cachedAvatars.get(question.author.id)} alt=""/>
				</div>
				<div className="flex flex-col grow">
					<div className="pb-4">
						<div className="flex justify-between pb-2">
							<div className="font-medium">
								{question.author.name}
							</div>
							<div className="small-text">
								{graphQlToStrDate(question.creation_date)}
							</div>
						</div>
						<p className="text-justify font-light  "> {question.content}</p>
					</div>
					<div className="flex h-4"/>
					<div className="flex flex-row justify-between font-light ">
						<div className="flex flex-col grow">
							<div className="flex flex-row">
								<div className="text">
									{questionStatusToString(question.status)}
								</div>
								<div className="flex w-1"/>
								<div className="italic hover:not-italic">
									{timeLeft}
								</div>
								</div>
							<div className="flex h-2"/>
							<QuestionStatusBar status={question.status}/>
						</div>
						<div className="flex flex-row items-center">
							<CoinStackIcon/>
							<div className="flex w-3"/>
							<div className="font-medium text-xl mb-2">
								{e3sToIcp(Number(question.reward))} ICP
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		</>
	);
};

export default Question;
