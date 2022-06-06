const Answer = ({ answer, questionState, handlePickWinner, plug }: any) => {
	// 	handlePickWinner(e, answer.id);

	const pickWinner = (
		<>
			{plug.isConnected &&
			plug.plug.principalId === questionState.question.author ? (
				<div className="flex ">
					<button onClick={(e) => handlePickWinner(e, answer.id)}>
						Pick Winner
					</button>
				</div>
			) : (
				<></>
			)}
		</>
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
		<div className="p-16 pr-10 pt-5 pb-5 bg-primary mb-4 min-h-24 ">
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
			<div className="form-check"></div>

			<div className="flex justify-end w-full">
				{questionState.question.status === "PICKANSWER" ? (
					pickWinner
				) : (
					<div></div>
				)}
			</div>
		</div>
	);
};

export default Answer;
