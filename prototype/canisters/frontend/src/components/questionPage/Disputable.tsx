import { useState } from "react";
import Answer from "./Answer";
import FieldWrapper from "../helperComponents/FieldWrapper";
import CallStateHandler from "../helperComponents/CallStateHandler";

const Disputable = ({ questionState, plug, fetch_data, login, cachedAvatars, loadAvatar }: any) => {
	const [callState, setCallState] = useState<any>({
		loading: false,
		error: false,
	});

	const handleTriggerDispute = async (e) => {
		e.preventDefault();
		setCallState({
			loading: true,
			error: false,
		});
		try {
			const res = await plug.actors.marketActor.trigger_dispute(
				questionState.question.id
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
				<div className="pt-10 pb-10">
					{questionState.question.winner ? (
						<>
							<div className="mb-4 decoration-yellow-500 underline ">
								{questionState.question.winner.author.name} has been picked by {questionState.question.author.name} as the winner
							</div>

							{plug.isConnected ? (
								<>
									<div className="flex justify-center mb-2">
										{plug.plug.principalId !== questionState.question.author.id ? (
											<button
												onClick={(e) => handleTriggerDispute(e)}
												className="my-button "
											>
												dispute
											</button>
										) : (
											<div>
												You cannot dispute as the author of the question
											</div>
										)}
									</div>
									<div className="flex justify-center">
										<CallStateHandler
											loading={callState.loading}
											err={callState.error}
											errMsg={"Something went wrong"}
										/>
									</div>
								</>
							) : (
								<div className="flex justify-center">
									<button
										onClick={login}
										className="my-button flex justify-center"
									>
										Login to Dispute
									</button>
								</div>
							)}
						</>
					) : (
						<div> Winner: No winner has been picked</div>
					)}
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

export default Disputable;
