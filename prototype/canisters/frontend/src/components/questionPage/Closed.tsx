import Answer from "./Answer";

const Closed = ({ questionState, plug }: any) => {
	return (
		<>
			<div className="w-full p-10 mb-5 border-t-2 border-b-2 h-44 flex justify-center items-center">
				Question is closed. Winner is: {questionState.question.winner.id}
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

export default Closed;
