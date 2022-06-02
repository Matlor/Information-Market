import { AttachMoney } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { questionStatusToString, graphQlToJsDate } from "../utils/conversions";

const QuestionPreview = ({ question }: any) => {
	const showQuestion = (question: any) => {
		if (Object.keys(question).length !== 0) {
			return (
				<>
					<div className="mb-8 ">
						<div className="flex justify-between">
							{/*   OWNER + CREATED_AT  DIV */}
							<div className="font-light text-xs mb-1">
								Submitted by{" "}
								<p className="no-underline hover:underline inline-block">
									user{" "}
								</p>{" "}
								at{" "}
								{graphQlToJsDate(question.creation_date).toLocaleString(undefined, {
									hour: "numeric",
									minute: "numeric",
									month: "long",
									day: "numeric",
								})}
							</div>
							{/*   STATUS DIV   */}
							<div className="font-light text-xs mb-1">
								{" "}
								Status: {questionStatusToString(question.status)}
							</div>
						</div>

						<div className="font-light text-2xl mb-2 ">
							{question.title}
						</div>
						<p className="text-justify font-light">
							{question.content}
						</p>
					</div>

					<div className="flex  items-center">
						<div className="flex items-center mr-5 font-light">
							<AttachMoney
								style={{
									color: "black",
									width: "17px",
								}}
								className="w-2"
							/>
							{Math.round(Number(question.reward) * 10000) / 10000} ICP
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
		<div className="p-2 border-b mb-10 cursor-pointer">
			<Link to={`/question/${question.id}`}>{showQuestion(question)}</Link>
		</div>
	);
};

export default QuestionPreview;
