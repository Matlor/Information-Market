import { useState } from "react";
import { statusMessageTransformer } from "../../utils";

const Body = ({ questionState, deadline }: any) => {
	const [countdown, setCountdown] = useState<any>("");

	setTimeout(() => {
		const date = new Date(null);
		var time = Math.round(Date.now() / 1000);
		var delta = deadline - time;
		date.setSeconds(delta);
		if (delta > -1) {
			setCountdown(date.toISOString().substr(11, 8));
		}
	}, 1000);

	return (
		<>
			<div className="border flex justify-between">
				<div className="flex justify-between">
					{/*   OWNER + CREATED_AT  DIV */}
					<div className="border font-light text-xs mb-1">
						Submitted by{" "}
						<p className="no-underline hover:underline inline-block">user </p>{" "}
						at{" "}
						{new Date(
							questionState.question.creation_date * 60 * 1000 * 1000
						).toLocaleString(undefined, {
							hour: "numeric",
							minute: "numeric",
							month: "short",
							day: "numeric",
						})}
					</div>
				</div>
				<div>
					{/*   STATUS DIV   */}
					<div className="border font-light text-xs mb-1">
						{" "}
						Status: {statusMessageTransformer(questionState.question.status)}
					</div>
				</div>
			</div>

			{/*   CONTENT DIV   */}
			<div className="mb-8 border">
				<div className="font-light text-2xl mb-2 ">
					Lorem Ipsum is simply dummy text of the printing and type setting
					industry. Lorem Ipsum has been the {questionState.question.content}
				</div>
				<p className="text-justify font-light">
					Created in component! Lorem Ipsum is simply dummy text of the printing
					and typesetting industry. Lorem Ipsum has been the industry's standard
					dummy text ever since the 1500s, when an unknown printer took a galley
					of type and scrambled it to make a type specimen book. It has survived
					not only five centuries, but also the leap into electronic
					typesetting, remaining essentially
				</p>
			</div>
			<div className="flex justify-between">
				{/*   REWARD DIV   */}
				<div className="flex  items-center ">
					<div className="flex items-center mr-5 font-light">
						Reward:{" "}
						{Math.round(Number(questionState.question.reward) * 10000) / 10000}{" "}
						ICP
					</div>
				</div>

				{/*   DEADLINE DIV   */}
				<div className="mb-2 ">
					{" "}
					{questionState.question.status === "PICKANSWER" ? (
						<div className="text-justify font-light">
							{" "}
							Deadline: {countdown}
						</div>
					) : (
						<div></div>
					)}
				</div>
			</div>
		</>
	);
};

export default Body;
