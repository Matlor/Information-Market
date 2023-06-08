import React, { useContext, useEffect } from "react";

import { Profile } from "../core/Profile";
import Stages from "../question/Stages";
import Answer from "../question/Answer";
import { SelectedTag, RewardTag, RewardIconTag } from "../core/Tag";
import Button, { LoadingWrapper } from "../core/Button";
import Menu from "../question/Menu";
import { TimeLeft } from "../core/Time";
import { Draggable, Drag } from "../question/Drag";
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
import { TimeStamp } from "../core/Time";
import Mail from "../core/Mail";
import parse from "html-react-parser";
import { List } from "../app/Layout";
import { ArrowIcon, CrossIcon, ReplyIcon } from "../core/Icons";

export interface UIQuestionProps {
	question: FQuestion;
	answers: IAnswer[];
	users: IUser[];
	answer: { answerInput: string; setAnswerInput: (input: string) => void };
	editorIsOpen: boolean;
	setEditorIsOpen: (isOpen: boolean) => void;
	select: {
		selected: number | null;
		setSelected: (id: number) => void;
	};
	viewCase: string;
	user: ICurrentUser;
}

const UIQuestion = ({
	question,
	answers,
	users,
	answer,
	editorIsOpen,
	setEditorIsOpen,
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
			reply: () => {
				return (
					<div
						onClick={() => setEditorIsOpen(true)}
						className="flex items-center self-end gap-2 mt-4 cursor-pointer rounded-1"
					>
						<div className="mt-[1px]">
							<ReplyIcon size={12} borderColor="gray-400" />{" "}
						</div>
						<div className="text-small">Reply</div>
					</div>
				);
			},
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
		<div className="mt-6 md:mt-[80px] ">
			<List>
				<div className="flex flex-col">
					<div className="flex items-center justify-between mb-4">
						<Profile
							principal={question.author_id}
							/* minutes={question.creation_date} */
						/>
						<div className="flex gap-2">
							<Stages stage={view.stages} />
							<div className="h-[36px]  flex justify-center items-center">
								<RewardTag reward={question.reward} />
							</div>
						</div>
					</div>
					<div data-cy="title" className="mb-5 h1">
						{question.title}
						{/* <div className="mt-3 mb-6">
						{<TimeStamp minutes={question.creation_date} />}{" "}
						<div className="h-[2px] mt-3 bg-gray-800 w-10"></div>
					</div> */}
					</div>{" "}
					<div data-cy="text" className="editor-content text-[#484B57]">
						{parse(question.content)}
					</div>
					{view?.reply ? view.reply() : null}
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
			</List>
			<div className="flex justify-center">
				{(() => {
					switch (view.footer) {
						case "editor":
							return (
								/* TODO: I could make this an instance and as such a
											separate component */
								<>
									{editorIsOpen && (
										<>
											<Draggable
												className={`w-full md:page-width fixed bottom-0 bg-white`}
											>
												{({ handleMouseDown }) => (
													<>
														<div className="flex items-center px-2">
															<Drag
																handleMouseDown={handleMouseDown}
																className="w-full"
															>
																<div className="flex flex-col w-full h-full gap-1 p-3">
																	<div className="h-[2px] mx-auto w-6 bg-gray-800 rounded-full"></div>
																	<div className="h-[2px] mx-auto w-6 bg-gray-800 rounded-full"></div>
																</div>
															</Drag>

															<div
																className="cursor-pointer"
																onClick={() => setEditorIsOpen(false)}
															>
																<CrossIcon size={12} strokeWidth={2} />
															</div>
														</div>

														<SlateEditor
															inputValue={answer.answerInput}
															setInputValue={answer.setAnswerInput}
															className={
																"flex flex-col gap-4 px-6  pb-6 pt-4 h-full  overflow-hidden"
															}
														>
															<div className="flex items-center ">
																<TollbarInstance className="flex w-full gap-4" />
															</div>

															<EditableInstance
																placeholder="Answer..."
																className="w-full overflow-auto !min-h-[80px] h-full"
															/>

															<div className="flex justify-end flex-1 gap-3">
																<TimeLeft
																	minutes={question.status_end_date}
																	icon={false}
																/>
																<LoadingWrapper
																	onClick={async () => {
																		await user.market.answer_question(
																			question.id,
																			answer.answerInput
																		);
																		answer.setAnswerInput("");
																		Mail("new answer");
																	}}
																>
																	<div className="px-[18px] py-[10px] bg-gray-100 rounded-full">
																		<ArrowIcon size={10} strokeWidth={3} />
																	</div>
																</LoadingWrapper>
															</div>
															<div className="flex justify-end"></div>
														</SlateEditor>
													</>
												)}
											</Draggable>
										</>
									)}
								</>
							);

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
		</div>
	);
};

export default UIQuestion;

//case "login":
/* TODO: create menu for this that asks to log in */
//return <Menu text="Login to Answer" />;

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
