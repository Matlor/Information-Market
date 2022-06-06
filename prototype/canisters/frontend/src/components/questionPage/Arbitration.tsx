import Answer from "./Answer";

const Arbitration = ({ questionState, plug }: any) => {
	return (
		<>
			<div className="border mt-2 mb-2">Arbitration in progress</div>
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

export default Arbitration;
