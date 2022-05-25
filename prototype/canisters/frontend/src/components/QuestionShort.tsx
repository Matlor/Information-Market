import { e8sToIcp } from "../utils/index";
import { AttachMoney } from "@mui/icons-material";

const QuestionShort = ({ question }: any) => {
	const showQuestion = (question: any) => {
		if (Object.keys(question).length !== 0) {
			const date = new Date(Number(question.deadlines.answers) / 1000);
			return (
				<>
					<div className="mb-8 ">
						<div className="font-light text-xs mb-1">
							Created at:{" "}
							{new Date(Number(question.timestamp) / 1000000).toLocaleString(
								undefined,
								{
									hour: "numeric",
									minute: "numeric",
									month: "short",
									day: "numeric",
								}
							)}
						</div>
						<div className="font-light text-2xl mb-2 ">
							Lorem Ipsum is simply dummy text of the printing and type setting
							industry. Lorem Ipsum has been the {question.content}
						</div>
						<p className="text-justify font-light">
							Lorem Ipsum is simply dummy text of the printing and typesetting
							industry. Lorem Ipsum has been the industry's standard dummy text
							ever since the 1500s, when an unknown printer took a galley of
							type and scrambled it to make a type specimen book. It has
							survived not only five centuries, but also the leap into
							electronic typesetting, remaining essentially{" "}
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
							{Math.round(e8sToIcp(Number(question.reward)) * 10000) / 10000}{" "}
							ICP
						</div>

						<div className="flex font-light">
							<div>
								Deadline:{" "}
								{new Date(
									Number(question.deadlines.answers) / 1000000
								).toLocaleString(undefined, {
									hour: "numeric",
									minute: "numeric",
									month: "short",
									day: "numeric",
								})}
							</div>
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
			{showQuestion(question)}
		</div>
	);
};

export default QuestionShort;
