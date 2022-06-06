import Answer from "./Answer";

const Arbitration = ({ questionState, plug }: any) => {
	return (
		<>
			<div className="w-full p-10 mb-5 border-t-2 border-b-2 h-44 flex justify-center items-center">
				A dispute has been triggered, arbitration is in progress
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

export default Arbitration;
