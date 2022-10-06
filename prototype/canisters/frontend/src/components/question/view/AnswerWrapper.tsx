import Answer from "./Answer";

const AnswerWrapper = ({
	answers,
	currentStatus,
	currentUserRole,
	cachedAvatars,
	pickedWinnerId,
	setWinner,
	winnerByChoiceId,
	finalWinnerId,
}: any) => {
	const currentCase = currentStatus + "." + currentUserRole;

	switch (currentCase) {
		case "OPEN.isQuestionAuthor":
		case "OPEN.isAnswerAuthor":
		case "OPEN.isNone":
		case "OPEN.isNotLoggedIn":
			return answers.map((answer) => {
				return (
					<div key={answer.id} data-cy="Answer">
						<Answer
							content={answer.content}
							date={answer.creation_date}
							authorName={answer.author.name}
							avatar={cachedAvatars.get(answer.author.id)}
							effect={"normal"}
							id={answer.id}
						/>
					</div>
				);
			});

		case "PICKANSWER.isQuestionAuthor":
			return answers.map((answer) => {
				return (
					<div
						key={answer.id}
						data-cy="Answer"
						onClick={() => setWinner(answer)}
					>
						<Answer
							content={answer.content}
							date={answer.creation_date}
							authorName={answer.author.name}
							avatar={cachedAvatars.get(answer.author.id)}
							effect={pickedWinnerId === answer.id ? "winner" : "hover"}
							id={answer.id}
						/>
					</div>
				);
			});
		case "PICKANSWER.isAnswerAuthor":
		case "PICKANSWER.isNone":
		case "PICKANSWER.isNotLoggedIn":
			return answers.map((answer) => {
				return (
					<div key={answer.id} data-cy="Answer">
						<Answer
							content={answer.content}
							date={answer.creation_date}
							authorName={answer.author.name}
							avatar={cachedAvatars.get(answer.author.id)}
							effect={"normal"}
							id={answer.id}
						/>
					</div>
				);
			});

		case "DISPUTABLE.isQuestionAuthor":
		case "DISPUTABLE.isAnswerAuthor":
		case "DISPUTABLE.isNone":
		case "DISPUTABLE.isNotLoggedIn":
			return answers.map((answer) => {
				return (
					<div key={answer.id} data-cy="Answer">
						<Answer
							content={answer.content}
							date={answer.creation_date}
							authorName={answer.author.name}
							avatar={cachedAvatars.get(answer.author.id)}
							effect={winnerByChoiceId === answer.id ? "winner" : "normal"}
							id={answer.id}
						/>
					</div>
				);
			});
		case "DISPUTED.isQuestionAuthor":
		case "DISPUTED.isAnswerAuthor":
		case "DISPUTED.isNone":
		case "DISPUTED.isNotLoggedIn":
			return answers.map((answer) => {
				return (
					<div key={answer.id} data-cy="Answer">
						<Answer
							content={answer.content}
							date={answer.creation_date}
							authorName={answer.author.name}
							avatar={cachedAvatars.get(answer.author.id)}
							effect={"normal"}
							id={answer.id}
						/>
					</div>
				);
			});
		case "CLOSED.isQuestionAuthor":
		case "CLOSED.isAnswerAuthor":
		case "CLOSED.isNone":
		case "CLOSED.isNotLoggedIn":
			return answers.map((answer) => {
				return (
					<div key={answer.id} data-cy="Answer">
						<Answer
							content={answer.content}
							date={answer.creation_date}
							authorName={answer.author.name}
							avatar={cachedAvatars.get(answer.author.id)}
							effect={finalWinnerId === answer.id ? "winner" : "normal"}
							id={answer.id}
						/>
					</div>
				);
			});
		default:
			return;
	}
};

export default AnswerWrapper;
