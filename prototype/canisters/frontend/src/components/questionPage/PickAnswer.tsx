import { useState } from "react";
import FieldWrapper from "../helperComponents/FieldWrapper";
import Answer from "./Answer";

const PickAnswer = ({ questionState, plug, fetch_data }: any) => {
	const [callState, setCallState] = useState<any>({
		loading: false,
		error: false,
	});

	const handlePickWinner = async (e, answerId) => {
		e.preventDefault();

		setCallState({
			loading: true,
			error: false,
		});

		try {
			const res = await plug.actors.marketActor.pick_winner(
				questionState.question.id,
				answerId
			);
			if (res.err) {
				setCallState({
					loading: false,
					error: true,
				});
			} else {
				setCallState({
					loading: false,
					error: false,
				});

				await fetch_data();
			}
		} catch (e) {
			setCallState({
				loading: false,
				error: true,
			});
			console.log(e);
		}
	};

	return (
		<>
			<FieldWrapper>
				{plug.isConnected &&
				plug.plug.principalId === questionState.question.author.id ? (
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
							callState={callState}
						/>{" "}
					</div>
				);
			})}
		</>
	);
};

export default PickAnswer;
