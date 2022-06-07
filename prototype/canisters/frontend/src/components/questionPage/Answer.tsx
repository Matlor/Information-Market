const Answer = ({ answer, questionState, handlePickWinner, plug }: any) => {
	var border = "border-b-2 ";
	const visualiseWinner = () => {
		try {
			if (questionState.question.status === "DISPUTABLE" || "DISPUTABLE") {
				if (answer.id === questionState.question.winner.id) {
					border = "border-yellow-500 border";
				}
			} else if (questionState.question.status === "CLOSED") {
				if (answer.id === questionState.question.winner.id) {
					border = "border-green-500 border";
				}
			}
		} catch (e) {
			console.log(e);
		}
	};
	visualiseWinner();

	// TODO: check if things are defined
	const pickWinner = (
		<>
			{questionState.question.status === "PICKANSWER" &&
			plug.isConnected &&
			plug.plug.principalId === questionState.question.author ? (
				<div className="flex justify-end w-full">
					<button
						className="bg-secondary hover:bg-primary my-button flex justify-end"
						onClick={(e) => handlePickWinner(e, answer.id)}
					>
						Pick Winner
					</button>
				</div>
			) : (
				<></>
			)}
		</>
	);

	const answerContent = (
		<>
			<div className="flex justify-between ">
				<div className="small-text">
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
			</div>
			<div className="text-justify font-light"> {answer.content}</div>
		</>
	);

	return (
		<div
			className={`p-16 pr-10 pt-5 pb-5 bg-primary mb-4 min-h-24 border ${border}`}
		>
			{answerContent}
			{pickWinner}
		</div>
	);
};

export default Answer;
