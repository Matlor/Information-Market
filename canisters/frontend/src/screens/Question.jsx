import React, { useState } from "react";

import Arrow from "../components/question/Arrow";
import Profile from "../components/question/Profile";
import Dots from "../components/question/Settings";
import Divider from "../components/question/Divider";
import Reward from "../components/question/Reward";
import Solution from "../components/question/Solution";
import Text from "../components/question/Text";
import Title from "../components/question/Title";
import Answer from "../components/question/Answer";
import Tag from "../components/question/Tag";
import Button from "../components/question/Button";
import Editor from "../components/question/Editor";
import Menu from "../components/question/Menu";
import Login from "../components/question/Login";
import TimeLeft from "../components/question/TimeLeft";

import ConditionToViews from "../components/question/ConditionToViews";
import { defineRole } from "../components/question/utils";

// for profile etc. I have to solve the issue of getting the author on the backend
// for pick and dispute: manage ongoing confirmation call to backend
const Question = ({ question, answers, user }) => {
	const [selected, setSelected] = useState(null);

	const resolve = {
		getAnswers: {
			solution: "open",
		},
		answer: {
			solution: "open",
			footer: "editor",
		},
		connectToAnswer: {
			solution: "open",
			footer: "login",
		},
		pick: {
			solution: "ongoing",
			tag: {
				condition: (id) => id === selected,
				component: <Tag option={"selected"} />,
			},
			answerButton: {
				condition: (id) => question.potentialWinner === null,
				component: (answer) => {
					return (
						<Button text={"select"} onClick={() => setSelected(answer.id)} />
					);
				},
			},
			footer: "menu",
		},
		dispute: {
			solution: "ongoing",
			tag: {
				condition: (id) => id === question.potentialWinner,
				component: () => {
					return <Tag option={"selected"} />;
				},
			},
			answerButton: {
				condition: (id) => id === question.potentialWinner,
				component: () => {
					return (
						<div>
							<TimeLeft seconds={question.status_end_date} />{" "}
							<Button
								text={"dispute"}
								onClick={() => () => console.log("call backend")}
							/>
						</div>
					);
				},
			},
		},
		ongoing: {
			solution: "ongoing",
		},
		closed: {
			solution: "closed",
			tag: {
				component: () => {
					return <Tag option={"winner"} />;
				},
				condition: (id) => id === question.finalWinner,
			},
		},
	};

	const role = defineRole(user, question, answers);
	console.log("role:", role);
	const viewCase = ConditionToViews(role, question.status);
	console.log("viewCase:", viewCase);
	const view = resolve[viewCase];
	console.log("view:", view);

	return (
		<div>
			<div className="flex flex-col gap-4 p-4">
				<div className="flex gap-4">
					<Arrow />
					<Profile name={"peter"} id={"id"} />
					<Dots />
				</div>

				<Divider />

				<div className="flex gap-4 mb-10 mt-10">
					<Reward reward={question.reward} />
					<Solution option={view.solution} />
				</div>

				<Title title={question.title} />
				<Text text={question.text} />

				<div className="flex flex-col gap-10 mt-10">
					{answers.map((answer) => (
						<Answer
							key={answer.id}
							content={answer.content}
							tag={
								view?.tag?.condition(answer.id) && view.tag.component(answer.id)
							}
							action={
								view?.answerButton?.condition(answer.id) &&
								view.answerButton.component(answer)
							}
						/>
					))}
				</div>

				<div className="mt-10">
					{(() => {
						switch (view.footer) {
							case "editor":
								return <Editor timeLeft={question.status_end_date} />;
							case "login":
								return <Login />;
							case "menu":
								return <Menu selected={selected} />;
							default:
								return <></>;
						}
					})()}
				</div>
			</div>
		</div>
	);
};

export default Question;

/* 
export interface Question {
	id: string;
	status: QuestionStatus;
	reward: number;
	title: string;
	content: string;
	invoice_id: bigint;
	answers: Array<string>;
	status_end_date: number;
	status_update_date: number;
	finalWinner: [] | [FinalWinner];
	author_id: Principal;
	close_transaction_block_height: [] | [bigint];
	open_duration: number;
	potentialWinner: [] | [string];
	creation_date: number;
} 
*/

/* 
		{viewProps.showEditor && !viewProps.showMenu && (
					<Editor timeLeft={question.status_end_date} />
				)}
				{!viewProps.showEditor && viewProps.showMenu && (
					<Menu option={viewProps.menu} />
				)}
                */

/* 
{viewProps.footer.type === "editor" && (
    <Editor timeLeft={question.status_end_date} />
)}

{viewProps.footer.type === "login" && <Login />}

{viewProps.footer.type === "menu" && (
    <Menu selected={viewProps.footer.prop} />
)}

*/

//                   option={viewProps.tag ? (viewProps.tag.condition(answer.id) ? viewProps.tag.value : null) : null}

/* 
Unshortened logic:
//viewProps?.tag ? viewProps.tag.condition(answer.id) ? <Tag option={viewProps.tag.value} /> : null : null


*/

//status: "OPEN" | "PICKANSWER" | "DISPUTABLE" | "ARBITRATION" | "CLOSED";

{
	/* Here the component that always is here, is itself a switch statement. 
          I could instead pass the components directly and only render "footer". 
          But then from reading it, it remains unclear what the footer could be. 
        */
}
