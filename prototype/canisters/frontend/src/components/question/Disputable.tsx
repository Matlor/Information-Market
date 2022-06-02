import Answer from "./Answer";

const Disputable = ({ questionState, plug, fetch_data, login }: any) => {
	const handleTriggerDispute = async (e) => {
		e.preventDefault();
		console.log(
			await plug.actors.marketActor.trigger_dispute(questionState.question.id)
		);
		await fetch_data();
	};

	const dispute = (
		<div className=" flex justify-between  items-center">
			<div className="">Winner: {questionState.question.winner.id}</div>
			<div>
				{" "}
				{plug.isConnected ? (
					<button
						onClick={(e) => handleTriggerDispute(e)}
						className="px-6 py-2  cursor-pointer bg-slate-50 rounded-full font-light"
					>
						{" "}
						dispute
					</button>
				) : (
					<div>
						<button
							onClick={login}
							className="px-2 py-2  cursor-pointer bg-slate-50 rounded-full "
						>
							Login to Dispute
						</button>
					</div>
				)}
			</div>
		</div>
	);

	return (
		<>
			<div className="border mt-4 mb-4">
				<div className="font-light">
					{questionState.question.winner ? (
						dispute
					) : (
						<div> Winner: No winner has been picked</div>
					)}
				</div>
			</div>
			<div className=" p-2">
				{questionState.answers.map((answer: any) => {
					return (
						<Answer
							plug={plug}
							answer={answer}
							key={answer.id}
							questionState={questionState}
						/>
					);
				})}
			</div>
		</>
	);
};

export default Disputable;
