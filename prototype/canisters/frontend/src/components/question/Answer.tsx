const Answer = ({ answer, questionState, handlePickWinner, plug }: any) => {
	const pickWinner = (
		<div className="font-light">
			{plug.isConnected &&
			plug.plug.principalId === questionState.question.author ? (
				<div className="border mt-2 mb-2 p-2 flex justify-end">
					<button
						className="px-2 py-2  cursor-pointer bg-slate-50 rounded-full "
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

	var border = "border";
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
		<div className={`${border} mb-2 mt-2 `}>
			<div className=" font-light text-xs mb-1">
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
