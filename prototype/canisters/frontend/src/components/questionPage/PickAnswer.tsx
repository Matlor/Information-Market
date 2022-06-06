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
		<div>
			<div className="w-full p-10 mb-5 border-t-2 border-b-2 h-44 flex justify-center items-center">
				A winner is being picked by the question initiator
			</div>

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
	);
};

export default PickAnswer;
