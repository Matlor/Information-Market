import React from "react";
import Answer from "./Answer";
import {
	User as IUser,
	Answer as IAnswer,
} from "../../../declarations/market/market.did.d";
import Profile from "../core/Profile";
import { get_user_from_id } from "../core/utils/utils";

interface IAnswerWrapper {
	currentCase: string;
	users: IUser[];
	answers: IAnswer[];
	winner: {
		currentWinner: string | undefined;
		setCurrentWinner: React.Dispatch<React.SetStateAction<string | undefined>>;
		potentialWinner: string | undefined;
		finalWinner: string | undefined;
	};
}

// TODO: users & hover
const AnswerWrapper = ({
	currentCase,
	users,
	answers,
	winner,
}: IAnswerWrapper) => {
	interface IAnswers {
		users: IUser[];
		answers: IAnswer[];
		winner?: string;
		handler?: React.Dispatch<React.SetStateAction<string | undefined>>;
	}
	const Answers = ({
		users,
		answers,
		winner = "",
		handler = () => {},
	}: IAnswers): any => {
		return answers.map((answer) => {
			const author = get_user_from_id(answer.author_id, users)!;
			return (
				<div
					data-cy="Answer"
					key={answer.id}
					onClick={() => handler(answer.id)}
					className={`${winner == answer.id ? "winner" : "shadow-md"}`}
				>
					<Answer answer={answer}>
						<Profile id={author.id} name={author.name} />
					</Answer>
				</div>
			);
		});
	};

	// TODO: reduce entire switch statement
	switch (currentCase) {
		case "PICKANSWER.isQuestionAuthor":
			return (
				<Answers
					users={users}
					answers={answers}
					winner={winner.currentWinner}
					handler={winner.setCurrentWinner}
				/>
			);

		case "DISPUTABLE.isQuestionAuthor":
		case "DISPUTABLE.isAnswerAuthor":
		case "DISPUTABLE.isNone":
		case "DISPUTABLE.isNotLoggedIn":
			return (
				<Answers
					users={users}
					answers={answers}
					winner={winner.potentialWinner}
				/>
			);

		case "CLOSED.isQuestionAuthor":
		case "CLOSED.isAnswerAuthor":
		case "CLOSED.isNone":
		case "CLOSED.isNotLoggedIn":
			// TODO:
			return (
				<Answers users={users} answers={answers} winner={winner.finalWinner} />
			);

		default:
			return <Answers users={users} answers={answers} />;
	}
};

/* 
HOVER
onMouseEnter={() => setIsOver(true)}
onMouseLeave={() => setIsOver(false)}
const [isOver, setIsOver] = useState(false);
isOver ? onHover : ""

*/

/* 

	var isEffect = false;
			if (winning_answer == answer.id) {
				isEffect = true;
			} else if (hoverIsActive && isOver) {
				isEffect = true;
			}
*/

/* 
	// TODO: simplify the switch statement
	switch (currentCase) {
		case "OPEN.isQuestionAuthor":
		case "OPEN.isAnswerAuthor":
		case "OPEN.isNone":
		case "OPEN.isNotLoggedIn":
			if (answers.length === 0) {
				return <NoAnswer />;
			}
			return answers.map((answer) => {
				let author = users.find((user) => user.id == answer.author_id);
				return (
					<div key={answer.id} data-cy="Answer">
						<Answer content={answer.content} effect={"normal"} id={answer.id}>
							<Profile
								id={author_id}
								name={authorName}
								get_avatar={get_avatar}
							/>
							<Date date={date} />
						</Answer>
					</div>
				);
			});

		case "PICKANSWER.isQuestionAuthor":
			if (answers.length === 0) {
				return <NoAnswer />;
			}
			return answers.map((answer) => {
				return (
					<div
						key={answer.id}
						data-cy="Answer"
						onClick={() => winner.setCurrentSelection(answer)}
					>
						<Answer
							content={answer.content}
							date={answer.creation_date}
							authorName={answer.author.name}
							get_avatar={get_avatar}
							effect={
								winner.currentSelection === answer.id &&
								winner.currentSelection
									? "winner"
									: "hover"
							}
							id={answer.id}
						/>
					</div>
				);
			});
		case "PICKANSWER.isAnswerAuthor":
		case "PICKANSWER.isNone":
		case "PICKANSWER.isNotLoggedIn":
			if (answers.length === 0) {
				return <NoAnswer />;
			}
			return answers.map((answer) => {
				return (
					<div key={answer.id} data-cy="Answer">
						<Answer
							content={answer.content}
							date={answer.creation_date}
							authorName={answer.author.name}
							get_avatar={get_avatar}
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
			if (answers.length === 0) {
				return <NoAnswer />;
			}
			return answers.map((answer) => {
				return (
					<div key={answer.id} data-cy="Answer">
						<Answer
							content={answer.content}
							date={answer.creation_date}
							authorName={answer.author.name}
							get_avatar={get_avatar}
							effect={
								Winner.potentialWinnerId === answer.id &&
								Winner.potentialWinnerId
									? "winner"
									: "normal"
							}
							id={answer.id}
						/>
					</div>
				);
			});
		case "ARBITRATION.isQuestionAuthor":
		case "ARBITRATION.isAnswerAuthor":
		case "ARBITRATION.isNone":
		case "ARBITRATION.isNotLoggedIn":
			if (answers.length === 0) {
				return <NoAnswer />;
			}
			return answers.map((answer) => {
				return (
					<div key={answer.id} data-cy="Answer">
						<Answer
							content={answer.content}
							date={answer.creation_date}
							authorName={answer.author.name}
							get_avatar={get_avatar}
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
			if (answers.length === 0) {
				return <NoAnswer />;
			}
			return answers.map((answer) => {
				return (
					<div key={answer.id} data-cy="Answer">
						<Answer
							content={answer.content}
							date={answer.creation_date}
							authorName={answer.author.name}
							get_avatar={get_avatar}
							effect={
								Winner.finalWinnerId === answer.id && Winner.finalWinnerId
									? "winner"
									: "normal"
							}
							id={answer.id}
						/>
					</div>
				);
			});
		default:
			return;
	}
};
 */

export default AnswerWrapper;

/* 
	if propId == answer.id do effect
	

	// got rid of this for now
		onMouseEnter={() => setIsOver(true)}
		onMouseLeave={() => setIsOver(false)}
		const [isOver, setIsOver] = useState(false);
	*/

/* const Hover = ({ children, clickHandler, answer, winnerId }: IHover) => {
		return { children };
	}; */
