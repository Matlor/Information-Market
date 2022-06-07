import FieldWrapper from "../layout/FieldWrapper";
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
			<FieldWrapper>
				{plug.isConnected &&
				plug.plug.principalId === questionState.question.author ? (
					<> Choose which answer should win the reward</>
				) : (
					<>A winner is being picked by the question initiator</>
				)}
			</FieldWrapper>

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
		</>
	);
};

export default PickAnswer;
