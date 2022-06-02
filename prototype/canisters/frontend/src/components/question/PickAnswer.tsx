import Answer from "./Answer";

const PickAnswer = ({ questionState, plug, fetch_data }: any) => {
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

	return (
		<>
			<div className=" p-2">
				{questionState.answers.map((answer: any) => {
					return (
						<div key={answer.id}>
							<Answer
								plug={plug}
								answer={answer}
								key={answer.id}
								questionState={questionState}
								handlePickWinner={handlePickWinner}
							/>{" "}
						</div>
					);
				})}
			</div>
		</>
	);
};

export default PickAnswer;
