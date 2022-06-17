import Answer from "./Answer";
import FieldWrapper from "../helperComponents/FieldWrapper";

const Closed = ({ questionState, plug, cachedAvatars, loadAvatar }: any) => {
	const checkIfWinner = () => {
		try {
			return <div>{questionState.question.winner.id}</div>;
		} catch (e) {
			return <></>;
		}
	};

	return (
		<>
			<FieldWrapper>
				<div className="w-full flex justify-center">
					Question is closed. Winner is: {checkIfWinner()}
				</div>
			</FieldWrapper>

			{questionState.answers.map((answer: any) => {
				return (
					<Answer
						plug={plug}
						answer={answer}
						key={answer.id}
						questionState={questionState}
						cachedAvatars={cachedAvatars}
						loadAvatar={loadAvatar}
					/>
				);
			})}
		</>
	);
};

export default Closed;
