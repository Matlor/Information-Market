import Answer from "./Answer";
import FieldWrapper from "../layout/FieldWrapper";

const Disputable = ({ questionState, plug, fetch_data, login }: any) => {
	const handleTriggerDispute = async (e) => {
		e.preventDefault();
		console.log(
			await plug.actors.marketActor.trigger_dispute(questionState.question.id)
		);
		await fetch_data();
	};

	return (
		<>
			<FieldWrapper>
				<div className="pt-10 pb-10">
					{questionState.question.winner ? (
						<>
							<div className="mb-4 decoration-yellow-500 underline ">
								Winner: {questionState.question.winner.id}
							</div>
							<div className="flex justify-center">
								{" "}
								{plug.isConnected ? (
									<button
										onClick={(e) => handleTriggerDispute(e)}
										className="my-button"
									>
										dispute
									</button>
								) : (
									<button onClick={login} className="my-button">
										Login to Dispute
									</button>
								)}
							</div>
						</>
					) : (
						<div> Winner: No winner has been picked</div>
					)}
				</div>
			</FieldWrapper>

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
		</>
	);
};

export default Disputable;
