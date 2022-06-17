import Answer from "./Answer";
import FieldWrapper from "../helperComponents/FieldWrapper";

const Arbitration = ({ questionState, plug, cachedAvatars, loadAvatar }: any) => {
	return (
		<>
			<FieldWrapper>
				A dispute has been triggered, arbitration is in progress
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

export default Arbitration;
