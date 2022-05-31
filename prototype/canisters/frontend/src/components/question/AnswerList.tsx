const AnswerList = ({ questionState, fetch_data, plug }: any) => {
	// TO DO:
	// - make it much cleaner
	// - payout
	// - frontend regularly fetching from backend to be up to date
	// - combine this component with the others to reduce complexity

	const handlePickWinner = async (e, answerId) => {
		e.preventDefault();
		console.log(
			await plug.actors.marketActor.pick_winner(
				questionState.question.id,
				answerId
			)
		);

		fetch_data();
	};

	const handleTriggerDispute = async (e) => {
		e.preventDefault();
		console.log(
			await plug.actors.marketActor.trigger_dispute(questionState.question.id)
		);
	};

	return (
		<>
			<div className="border mt-4 mb-4 pt-4 pb-4">
				{questionState.question.status === "DISPUTABLE" &&
				questionState.question.winner.id &&
				plug.isConnected ? (
					<>
						<div className="border font-light">
							Winner: {questionState.question.winner.id}
						</div>
						<div className="border mt-4 ">
							<button
								onClick={(e) => handleTriggerDispute(e)}
								className="px-6 py-2  cursor-pointer bg-slate-50 rounded-full font-light"
							>
								Dispute
							</button>
						</div>
					</>
				) : (
					<div></div>
				)}
			</div>
			<div className="mt-5 mb-5 border">
				<div className=" p-2">
					{questionState.answers.map((answer: any, index: number) => {
						return (
							<div key={index} className="border  mb-5 ">
								<div className="border font-light text-xs mb-1">
									Submitted by{" "}
									<p className="no-underline hover:underline inline-block">
										user{" "}
									</p>{" "}
									at{" "}
									{new Date(
										answer.creation_date * 60 * 1000 * 1000
									).toLocaleString(undefined, {
										hour: "numeric",
										minute: "numeric",
										month: "short",
										day: "numeric",
									})}
								</div>
								<div className="text-justify font-light"> {answer.content}</div>

								<div className="mt-2 mb-2 ">
									{questionState.question.status === "PICKANSWER" &&
									plug.plug.principalId === questionState.question.author ? (
										<button
											className="px-6 py-2  cursor-pointer bg-slate-50 rounded-full "
											onClick={(e) => {
												handlePickWinner(e, answer.id);
											}}
										>
											{" "}
											Pick Winner
										</button>
									) : (
										<div></div>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
};

export default AnswerList;
