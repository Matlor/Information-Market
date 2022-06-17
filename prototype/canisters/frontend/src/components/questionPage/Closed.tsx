import Answer from "./Answer";
import FieldWrapper from "../helperComponents/FieldWrapper";

const Closed = ({ questionState, plug, cachedAvatars, loadAvatar }: any) => {
	const checkIfWinner = () => {
		try {
			if (questionState.question.winner===null){
				return "";
			}
			return ", the winner is " + questionState.question.winner.author.name;
		} catch (e) {
			return <></>;
		}
	};

	return (
		<>
			<FieldWrapper>
				<div className="w-full flex justify-center">
					Question is closed{checkIfWinner()}
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
