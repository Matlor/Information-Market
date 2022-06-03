const Answer = ({ answer, questionState, handlePickWinner, plug }: any) => {
	const pickWinner = (
		<div className="font-light">
			{plug.isConnected &&
			plug.plug.principalId === questionState.question.author ? (
				<div className="mt-2 mb-2 p-2 flex justify-end">
					<button
						className="my-button"
						onClick={(e) => {
							handlePickWinner(e, answer.id);
						}}
					>
						{" "}
						Pick Winner
					</button>
				</div>
			) : (
				<div></div>
			)}
		</div>
	);

	var border = "border-b-2 ";
	const visualiseWinner = () => {
		if (questionState.question.status === "DISPUTABLE") {
			if (answer.id === questionState.question.winner.id) {
				border = "border-yellow-500 border";
			}
		} else if (questionState.question.status === "CLOSED") {
			if (answer.id === questionState.question.winner.id) {
				border = "border-green-500 border";
			}
		} else {
		}
	};
	visualiseWinner();

	return (
		<div className={`pb-10 pt-10 `}>
			<div className="flex justify-between">
				<div className=" font-light text-xs mb-2 ">
					Submitted by{" "}
					<p className="no-underline hover:underline inline-block">user </p> at{" "}
					{new Date(answer.creation_date * 60 * 1000 * 1000).toLocaleString(
						undefined,
						{
							hour: "numeric",
							minute: "numeric",
							month: "short",
							day: "numeric",
						}
					)}
				</div>
				{questionState.question.status === "DISPUTABLE" &&
				answer.id === questionState.question.winner.id ? (
					<div className=" font-light text-xs bg-orange-300 self-center">
						WINNER
					</div>
				) : (
					<></>
				)}
			</div>
			<div className="text-justify font-light"> {answer.content}</div>

			{questionState.question.status === "PICKANSWER" ? (
				pickWinner
			) : (
				<div></div>
			)}
		</div>
	);
};

export default Answer;
