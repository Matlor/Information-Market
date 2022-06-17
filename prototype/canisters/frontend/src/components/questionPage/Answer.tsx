import { useState } from "react";
import CallStateHandler from "../helperComponents/CallStateHandler";
import SubmittedBy from "../helperComponents/SubmittedBy";
import parse from "html-react-parser";

const Answer = ({
	answer,
	questionState,
	handlePickWinner,
	plug,
	callState,
}: any) => {
	var border = "";
	const visualiseWinner = () => {
		if (
			!questionState.question.winner ||
			!questionState.question.winner.id ||
			!answer.id
		) {
			return;
		}
		if (questionState.question.status === "DISPUTABLE" || "DISPUTABLE") {
			if (answer.id === questionState.question.winner.id) {
				border = "border border-yellow-500 border";
			}
		} else if (questionState.question.status === "CLOSED") {
			if (answer.id === questionState.question.winner.id) {
				border = "border border-green-500 border";
			}
		}
	};
	visualiseWinner();

	const pickWinner = (
		<>
			{questionState.question.status === "PICKANSWER" &&
			plug.isConnected &&
			plug.plug.principalId === questionState.question.author ? (
				<>
					<div className="flex justify-end w-full">
						<div>
							<button
								className="bg-secondary hover:bg-primary my-button mb-2 mt-2"
								onClick={(e) => handlePickWinner(e, answer.id)}
							>
								Pick Winner
							</button>

							<CallStateHandler
								loading={callState.loading}
								err={callState.err}
								errMsg={"Something went wrong"}
							/>
						</div>
					</div>
				</>
			) : (
				<></>
			)}
		</>
	);

	const [show, setShow] = useState<any>(false);

	const answerContent = (
		<>
			<SubmittedBy
				author={answer.author}
				creation_date={answer.creation_date}
			/>
			<div className="editor-wrapper">{parse(answer.content)}</div>
		</>
	);

	return (
		<div className={`p-16 pr-10 pt-5 pb-5 bg-primary mb-4 min-h-24 ${border}`}>
			{answerContent}
			{pickWinner}
		</div>
	);
};

export default Answer;
