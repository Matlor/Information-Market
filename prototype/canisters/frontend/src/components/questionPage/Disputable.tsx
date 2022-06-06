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
		<div className="items-center ">
			<div className="mb-4 decoration-yellow-500 underline ">
				Winner: {questionState.question.winner.id}
			</div>
			<div className="flex justify-center ">
				{" "}
				{plug.isConnected ? (
					<button
						onClick={(e) => handleTriggerDispute(e)}
						className="my-button"
					>
						{" "}
						dispute
					</button>
				) : (
					<div>
						<button onClick={login} className="my-button">
							Login to Dispute
						</button>
					</div>
				)}
			</div>
		</div>
	);

	return (
		<>
			<div className="font-light w-full p-10 mb-5 border-t-2 border-b-2 h-44 flex justify-center items-center">
				{questionState.question.winner ? (
					dispute
				) : (
					<div> Winner: No winner has been picked</div>
				)}
			</div>
			<div>
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
