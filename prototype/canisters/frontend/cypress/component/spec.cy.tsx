/* for (let i = 0; i < questions.length; i++) {
	console.log(calcUserRole(questions[i].question, questions[i].ourUser));
} */

import "../../src/index.css";
import sudograph from "../../src/components/core/services/sudograph";
import Question from "../../src/screens/Question";
import { mount } from "cypress/react18";
import { graphQlToStrDate } from "../../src/components/core/services/utils/conversions";
import QuestionGenerator from "./QuestionGenerator";

const calcUserRole = (question, user) => {
	var userRole: string = "";

	const hasAnswered = () => {
		for (let i = 0; i < question.answers.length; i++) {
			if (user === question.answers[i].author.id) {
				return true;
			}
		}
		return false;
	};
	if (question.author.id === user) {
		userRole = "isQuestionAuthor";
	} else if (hasAnswered()) {
		userRole = "isAnswerAuthor";
	} else if (user.length > 0) {
		userRole = "isNone";
	} else if (user.length === 0) {
		userRole = "isNotLoggedIn";
	} else {
		throw Error("userRole not found");
	}

	return userRole;
};

const questions: any = QuestionGenerator();

const test = (question, answers, ourUser) => {
	describe("Question.cy.js", () => {
		beforeEach(() => {
			cy.viewport(1280, 800);
			mount(
				<Question
					isConnected={ourUser ? true : false}
					userPrincipal={ourUser}
					answerQuestion={() => console.log("answerQuestion")}
					pickWinner={() => console.log("pickWinner")}
					triggerDispute={() => console.log("triggerDispute")}
				/>
			);
			cy.stub(sudograph, "get_question").returns({
				data: {
					readQuestion: [question],
				},
			});

			cy.stub(sudograph, "get_question_answers").returns({
				data: {
					readAnswer: answers,
				},
			});
		});

		var currentCase = question.status + "." + calcUserRole(question, ourUser);

		// todo: profile picture
		const testAnswerContent = () => {
			for (let i = 0; i < answers.length; i++) {
				cy.get(`[data-cy=Answer]`).should("have.length", answers.length);

				cy.get(`[data-cy=Answer-${answers[i].id}]`)
					.should("be.visible")
					.and("contain", answers[i].content)
					.and("contain", answers[i].author.name)
					.and("contain", graphQlToStrDate(answers[i].creation_date));
			}
		};

		const testShadowEffects = (effectCase, winner) => {
			// CASE: NORMAL
			if (effectCase === "normal") {
				cy.get(`[data-cy=Answer] > div`).should("have.class", "shadow-md");

				// CASE: WINNER
			} else if (effectCase === "winner") {
				// for loop
				for (let i = 0; i < answers.length; i++) {
					if (winner === answers[i].id) {
						cy.get(`[data-cy=Answer-${answers[i].id}]`).should(
							"have.class",
							"shadow-effect"
						);
					} else {
						cy.get(`[data-cy=Answer-${answers[i].id}]`).should(
							"have.class",
							"shadow-md"
						);
					}
				}
				// CASE: HOVER
			} else if (effectCase === "hover") {
				// todo: test hovering
				/* for (let i = 0; i < answers.length; i++) {
					if (winner === answers[i].id) {
						cy.get(`[data-cy=Answer-${answers[i].id}]`).should(
							"have.class",
							"shadow-effect"
						);
					} else if (winner !== answers[i].id) {
						cy.get(`[data-cy=Answer-${answers[i].id}]`).should(
							"have.class",
							"shadow-md"
						);
						cy.get(`[data-cy=Answer-${answers[i].id}]`).trigger("mouseover");
						cy.get(`[data-cy=Answer-${answers[i].id}]`).should(
							"have.class",
							"shadow-effect"
						);
						cy.get(`[data-cy=Answer-${answers[i].id}]`).trigger("mouseout");
						cy.get(`[data-cy=Answer-${answers[i].id}]`).should(
							"have.class",
							"shadow-md"
						);
					}
				} */
			}
		};

		const questionBody = () => {
			// todo: add date
			cy.get("[data-cy=QuestionBody]")
				.should("contain", `${question.title}`)
				.and("contain", `${question.title}`)
				.and("contain", `${question.title}`);
			cy.get("[data-cy=QuestionBody]").find("img").should("be.visible");
			cy.get("[data-cy=QuestionBody]").should("contain", "answers");
		};

		const Open = (currentCase, question) => {
			// TITLE
			if (currentCase === "OPEN.isQuestionAuthor") {
				cy.get("[data-cy=Title]")
					.should("contain", "Open 1/5")
					.and("contain", "Other Users can now Answer your Question");
			} else if (
				currentCase === "OPEN.isAnswerAuthor" ||
				currentCase === "OPEN.isNone" ||
				currentCase === "OPEN.isNotLoggedIn"
			) {
				cy.get("[data-cy=Title]")
					.should("contain", "Open 1/5")
					.and("contain", "Answer the Question to win the Reward");
			}
			// MENU
			cy.get("[data-cy=QuestionMenu]")
				.should("contain", "Reward")
				.and("contain", "ICP")
				.and("contain", "Time Left");

			// QUESTION
			questionBody();

			// EDITOR
			if (currentCase === "OPEN.isQuestionAuthor") {
				cy.get("[data-cy=SlateEditor]").should("not.exist");
			} else if (currentCase === "OPEN.isAnswerAuthor") {
				cy.get("[data-cy=SlateEditor]").should("be.visible");
				cy.get("[data-cy=SlateSubmit]").should("contain", "Submit");
			} else if (currentCase === "OPEN.isNone") {
				cy.get("[data-cy=SlateEditor]").should("be.visible");
				cy.get("[data-cy=SlateSubmit]").should("contain", "Submit");
			} else if (currentCase === "OPEN.isNotLoggedIn") {
				cy.get("[data-cy=SlateEditor]").should("be.visible");
				cy.get("[data-cy=SlateSubmit]").should("contain", "Log in to answer");
			}

			// ANSWERS
			testAnswerContent();
			testShadowEffects("normal", "");
		};

		const PickWinner_Question_NotSelected = (currentCase, question) => {
			// TITLE
			cy.get("[data-cy=Title]")
				.should("contain", "Winner Selection 2/5")
				.and("contain", "Select a Winner");

			// MENU
			// todo: date & profile pic
			cy.get("[data-cy=QuestionMenu]")
				.should("contain", "Reward")
				.and("contain", "ICP")
				.and("contain", "Time Left")
				.and("contain", "Selected User")
				.and("contain", "None Selected");
			cy.get("[data-cy=QuestionMenu]")
				.find("[data-cy=ArrowButton]")
				.should("be.visible");

			// QUESTION
			questionBody();

			// EDITOR
			cy.get("[data-cy=SlateEditor]").should("not.exist");

			// ANSWERS
			testAnswerContent();

			testShadowEffects("hover", "");
		};

		const PickWinner_Question_Selected = (currentCase, question) => {
			// TITLE
			cy.get("[data-cy=Title]")
				.should("contain", "Winner Selection 2/5")
				.and("contain", "Confirm your Choice");

			// MENU
			cy.get("[data-cy=QuestionMenu]")
				.should("contain", "Reward")
				.and("contain", "ICP")
				.and("contain", "Time Left");

			cy.get("[data-cy=QuestionMenu]").should("contain", "Selected User");
			cy.get("[data-cy=QuestionMenu]").find("img").should("be.visible");

			cy.get("[data-cy=QuestionMenu]").and("contain", "Confirm");
			cy.get("[data-cy=QuestionMenu]")
				.find("[data-cy=ArrowButton]")
				.should("be.visible");

			// QUESTION
			questionBody();

			// EDITOR
			cy.get("[data-cy=SlateEditor]").should("not.exist");

			// ANSWERS
			testAnswerContent();
			// todo should contain pickedWinner but can't refer to it yet
			testShadowEffects("hover", "");
		};

		const PickWinner_Answer_None_NotLoggedIn = (currentCase, question) => {
			// TITLE
			cy.get("[data-cy=Title]")
				.should("contain", "Winner Selection 2/5")
				.and("contain", "A Winner is being Selected");

			// MENU
			cy.get("[data-cy=QuestionMenu]")
				.should("contain", "Reward")
				.and("contain", "ICP")
				.and("contain", "Time Left");

			// QUESTION
			questionBody();

			// EDITOR
			cy.get("[data-cy=SlateEditor]").should("not.exist");

			// ANSWERS
			testAnswerContent();
			testShadowEffects("normal", "");
		};

		const Dispute_Question_None_NotLoggedIn = (currentCase, question) => {
			// TITLE
			cy.get("[data-cy=Title]")
				.should("contain", "Dispute 3/5")
				.and(
					"contain",
					"If you answered the Question you can dispute the choice of the Author"
				);

			// MENU
			cy.get("[data-cy=QuestionMenu]")
				.should("contain", "Reward")
				.and("contain", "ICP")
				.and("contain", "Time Left");

			cy.get("[data-cy=QuestionMenu]").should("contain", "Selected User");
			cy.get("[data-cy=QuestionMenu]").find("img").should("be.visible");

			// QUESTION
			questionBody();

			// EDITOR
			cy.get("[data-cy=SlateEditor]").should("not.exist");

			// ANSWERS
			testAnswerContent();
			testShadowEffects("winner", question.winner);
		};
		const Dispute_Answer = (currentCase, question) => {
			// TITLE
			cy.get("[data-cy=Title]")
				.should("contain", "Dispute 3/5")
				.and("contain", "Dispute the Choice of the Question Author");

			// MENU
			cy.get("[data-cy=QuestionMenu]")
				.should("contain", "Reward")
				.and("contain", "ICP")
				.and("contain", "Time Left");

			cy.get("[data-cy=QuestionMenu]").should("contain", "Selected User");
			cy.get("[data-cy=QuestionMenu]").find("img").should("be.visible");

			cy.get("[data-cy=QuestionMenu]").should("contain", "Dispute");

			cy.get("[data-cy=QuestionMenu]")
				.find("[data-cy=ArrowButton]")
				.should("be.visible");

			// QUESTION
			questionBody();

			// EDITOR
			cy.get("[data-cy=SlateEditor]").should("not.exist");

			// ANSWERS
			testAnswerContent();
			testShadowEffects("winner", question.winner);
		};
		const Arbitration = (currentCase, question) => {
			// TITLE
			cy.get("[data-cy=Title]")
				.should("contain", "Arbitration 4/5")
				.and("contain", "Arbitration is ongoing");

			// MENU
			cy.get("[data-cy=QuestionMenu]")
				.should("contain", "Reward")
				.and("contain", "ICP")
				.and("contain", "Time Left");

			// QUESTION
			questionBody();

			// EDITOR
			cy.get("[data-cy=SlateEditor]").should("not.exist");

			// ANSWERS
			testAnswerContent();
			testShadowEffects("normal", "");
		};
		const Payout = (currentCase, question) => {
			// TODO: Finish the design. Maybe with the transaction?
			// TODO: I might need the transaction to be included in this whole process

			// TITLE
			cy.get("[data-cy=Title]")
				.should("contain", "Payout 5/5")
				.and("contain", "The Reward has been paid to the Winner");

			// MENU
			cy.get("[data-cy=QuestionMenu]")
				.should("contain", "Reward")
				.and("contain", "ICP")
				.and("contain", "Final Winner");
			cy.get("[data-cy=QuestionMenu]").find("img").should("be.visible");

			// QUESTION
			questionBody();

			// EDITOR
			cy.get("[data-cy=SlateEditor]").should("not.exist");

			// ANSWERS
			testAnswerContent();
			testShadowEffects("winner", question.winner);
		};

		it(`${currentCase}`, () => {
			switch (currentCase) {
				case "OPEN.isQuestionAuthor":

				case "OPEN.isAnswerAuthor":

				case "OPEN.isNone":

				case "OPEN.isNotLoggedIn":
					Open(currentCase, question);
					break;

				case "PICKANSWER.isQuestionAuthor":
					PickWinner_Question_NotSelected(currentCase, question);

					// TODO: This case is hard to reach in tests
					/* 	cy.get("[data-cy=Answer]").click();
					PickWinner_Question_Selected(currentCase, question); */

					break;
				case "PICKANSWER.isAnswerAuthor":
				case "PICKANSWER.isNone":
				case "PICKANSWER.isNotLoggedIn":
					PickWinner_Answer_None_NotLoggedIn(currentCase, question);
					break;

				case "DISPUTABLE.isQuestionAuthor":
					Dispute_Question_None_NotLoggedIn(currentCase, question);
					break;
				case "DISPUTABLE.isAnswerAuthor":
					Dispute_Answer(currentCase, question);
					break;
				case "DISPUTABLE.isNone":
					Dispute_Question_None_NotLoggedIn(currentCase, question);
					break;
				case "DISPUTABLE.isNotLoggedIn":
					Dispute_Question_None_NotLoggedIn(currentCase, question);
					break;

				case "DISPUTED.isQuestionAuthor":
				case "DISPUTED.isAnswerAuthor":
				case "DISPUTED.isNone":
				case "DISPUTED.isNotLoggedIn":
					Arbitration(currentCase, question);
					break;

				case "CLOSED.isQuestionAuthor":
				case "CLOSED.isAnswerAuthor":
				case "CLOSED.isNone":
				case "CLOSED.isNotLoggedIn":
					Payout(currentCase, question);
					break;
			}
		});
	});
};

for (let i = 0; i < questions.length; i++) {
	test(questions[i].question, questions[i].answers, questions[i].ourUser);
}
