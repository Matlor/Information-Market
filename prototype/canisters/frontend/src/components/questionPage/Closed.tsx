import Answer from "./Answer";

const Closed = ({ questionState, plug }: any) => {
	return (
		<>
			<div className="font-light border mt-2 mb-2 ">
				Question is closed. Winner is: @todo
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
