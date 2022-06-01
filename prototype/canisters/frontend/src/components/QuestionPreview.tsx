import { AttachMoney } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { statusMessageTransformer } from "../utils";

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
								{new Date(
									question.creation_date * 60 * 1000 * 1000
								).toLocaleString(undefined, {
									hour: "numeric",
									minute: "numeric",
									month: "short",
									day: "numeric",
								})}
							</div>
							{/*   STATUS DIV   */}
							<div className="font-light text-xs mb-1">
								{" "}
								Status: {statusMessageTransformer(question.status)}
							</div>
						</div>

						<div className="font-light text-2xl mb-2 ">
							{/* Lorem Ipsum is simply dummy text of the printing and type setting
							industry. Lorem Ipsum has been the */}{" "}
							{question.content}
						</div>
						<p className="text-justify font-light">fvofdhvofih</p>
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
