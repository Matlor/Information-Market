import React from "react";
import { Profile } from "../core/Profile";
import Stages from "../question/Stages";
import Answer from "../question/Answer";
import { SelectedTag, RewardTag, RewardIconTag } from "../core/Tag";
import Button from "../core/Button";
import Menu from "../question/Menu";
import { TimeLeft } from "../core/Time";
import Drag from "../question/Drag";
import {
	SlateEditor,
	TollbarInstance,
	EditableInstance,
} from "../addQuestion/SlateEditor";

import {
	Answer as IAnswer,
	User as IUser,
} from "../../../declarations/market/market.did";
import { FQuestion } from "../../screens/Question";
import { ICurrentUser } from "../../screens/App";

import Mail from "../core/Mail";
import parse from "html-react-parser";

export interface UIQuestionProps {
	question: FQuestion;
	answers: IAnswer[];
	users: IUser[];
	answer: { answerInput: string; setAnswerInput: (input: string) => void };
	select: {
		selected: string | null;
		setSelected: (id: string) => void;
	};
	viewCase: string;
	user: ICurrentUser;
}

const UIQuestion = ({
	question,
	answers,
	users,
	answer,
	select,
	viewCase,
	user,
}: UIQuestionProps) => {
	const resolve = {
		getAnswers: {
			stages: "open",
		},
		answer: {
			stages: "open",
			footer: "editor",
		},
		connectToAnswer: {
			stages: "open",
			footer: "login",
		},
		pick: {
			stages: "ongoing",
			tag: (id) => {
				return id === select.selected && <SelectedTag />;
			},
			answerButton: (id) => {
				return (
					<Button
						size={"sm"}
						color="gray"
						onClick={async () => select.setSelected(id)}
						text={"Select"}
						arrow={true}
					/>
				);
			},
			footer: "menu",
		},
		dispute: {
			stages: "ongoing",
			tag: (id) => {
				return question.potentialWinner === id && <SelectedTag />;
			},
			answerButton: (id) => {
				console.log(id, "id", question?.potentialWinner, "winner");
				return (
					<>
						{question?.potentialWinner === id && (
							<div className="flex items-center gap-5">
								<TimeLeft minutes={question.status_end_date} />
								<Button
									onClick={async () => {
										console.log(await user.market.dispute(question.id));
									}}
									arrow={true}
									text="Dispute"
									size="sm"
									color="gray"
								/>
							</div>
						)}
					</>
				);
			},
		},
		ongoing: {
			stages: "ongoing",
		},
		closed: {
			stages: "closed",
			tag: (id) => {
				return (
					question.finalWinner === id && (
						<RewardIconTag reward={question.reward} />
					)
				);
			},
		},
	};

	const view = resolve[viewCase];
	console.log(question.author_id.toString());
	console.log(viewCase);

	return (
		<>
			<div className="space-y-2">
				<div className="flex justify-between">
					<Profile
						name={"peter"}
						principal={question.author_id}
						minutes={question.creation_date}
					/>
					<div className="flex gap-4">
						<Stages stage={view.stages} />
						<RewardTag reward={question.reward} />
					</div>
				</div>

				<div data-cy="title" className="h1 ">
					{question.title}
				</div>

				<div data-cy="text" className="editor-content">
					{parse(question.content)}
				</div>
			</div>

			{answers.map((answer) => (
				<div key={answer.id} data-cy="answer">
					<Answer
						author_id={answer.author_id}
						content={answer.content}
						tag={view?.tag ? view.tag(answer.id) : null}
						action={view?.answerButton ? view.answerButton(answer.id) : null}
						timeStamp={answer.creation_date}
					/>
				</div>
			))}

			<div className="flex justify-center">
				{(() => {
					switch (view.footer) {
						case "editor":
							return (
								/* TODO: I could make this an instance and as such a separate component */
								<Drag>
									<SlateEditor
										setInputValue={answer.setAnswerInput}
										className={"flex flex-col gap-6 justify-center px-6 py-4 "}
									>
										<div className="flex">
											<div className="flex flex-1">
												<TollbarInstance />
											</div>
											<div className="flex h-[6px] self-center w-8 rounded-md bg-gray-500 rounded-full"></div>
											<div className="flex justify-end flex-1">
												<TimeLeft minutes={question.status_end_date} />
											</div>
										</div>
										<EditableInstance placeholder="Answer..." />
										<Button
											onClick={async () => {
												await user.market.answer_question(
													question.id,
													answer.answerInput
												);
												Mail("new answer");
											}}
											arrow={true}
											size="sm"
											color="black"
											text={"Submit"}
										/>
									</SlateEditor>
								</Drag>
							);
						case "login":
							/* TODO: create menu for this that asks to log in */
							return <Menu text="Login to Answer" />;
						case "menu":
							return (
								<>
									{select.selected ? (
										<Menu
											text="Confirm your Choice"
											onClick={async () => {
												console.log(
													await user.market.pick_answer(
														question.id,
														select.selected
													)
												);
											}}
											time={<TimeLeft minutes={question.status_end_date} />}
										/>
									) : (
										<Menu
											text="Select a winner"
											time={<TimeLeft minutes={question.status_end_date} />}
										/>
									)}
								</>
							);
						default:
							return <></>;
					}
				})()}
			</div>
		</>
	);
};

export default UIQuestion;

/* 
In the end:
- if logged in & princ===author & pick status  -> then the user can run the pick func. 
- for that particular case we define certain props we want to pass to the func. 

So all the conditions could be thought of as that, I could have one large condition that checks all the conditions and then returns the props that are needed for the func.
Then it would give me an error if I tried to pass it a func to call when the user is not certainly logged in.
Imagine a large file with all the conditions. 

Now the step between I do is about the roles. 
When I have asserted what a role implies then I could use it in the switch statement. 

And then it should warn me not to do wrong stuff. 


switch (true) {
    case user.principal !== undefined && question.author === user.principal && question.status === "pickanswer":
        // Code
        break;
    case role === "author" && question.status === "pickanswer":
        // Code
        break;
    // etc.
}

switch (true) {
			case user.principal !== undefined &&
				question.author_id === user.principal &&
				moStatusToString(question.status) === "PICKANSWER":
				break;

			default:
				break;
		}


-> switch statement does not seem to enforce the condition and work with ts.

if(user.principal !== undefined && question.author_id === user.principal && moStatusToString(question.status) === "PICKANSWER") {
			user.market.answer_question(question.id, answer.answerInput);
        }
        -> only this works.

*/