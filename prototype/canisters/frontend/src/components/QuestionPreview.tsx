import { AttachMoney } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { questionStatusToString, graphQlToJsDate } from "../utils/conversions";

const QuestionPreview = ({ question }: any) => {
	const showQuestion = (question: any) => {
		if (Object.keys(question).length !== 0) {
			return (
				<>
					<div className="mb-6  ">
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

						<div className="font-medium text-2xl mb-2 ">{question.title}</div>
						<p className="text-justify font-light  ">{question.content}</p>
					</div>
					{/*   REWARD DIV   */}
					<div className="flex  items-center">
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
					</div>
				</>
			);
		} else {
			return <div>No question</div>;
		}
	};
	//

	return (
		<div className="cursor-pointer pb-10 pt-14 border-b-2 border-secondary">
			<Link to={`/question/${question.id}`}>{showQuestion(question)}</Link>
		</div>
	);
};

export default QuestionPreview;
