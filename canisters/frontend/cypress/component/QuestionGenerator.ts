const QuestionGenerator = () => {
	const ourUser = {
		principal:
			"tsm3f-vuuza-xfy3b-wcbrx-r4nzg-jy6o2-ydpbq-67lqa-rgq6j-ijkaa-aqe",
		empty: "",
	};

	const otherUsers = {
		firstUser: {
			Principal: "5s4az4-fcodv-le7ch-4tayy-d2mje-7uf6m-dmvh7-ou2bn-xxs6",
		},
		secondUser: {
			Principal:
				"ncyi2-qwewu-cqcie-kr3bw-zqc44-3dnkn-le75r-zso7t-ztbvh-gw5hm-aae",
		},
	};

	const authorCombination = {
		isQuestionAuthor: {
			Plug: ourUser.principal,
			Quesiton: ourUser.principal,
			Answer: otherUsers.firstUser.Principal,
		},
		isAnswerAuthor: {
			Plug: ourUser.principal,
			Quesiton: otherUsers.firstUser.Principal,
			Answer: ourUser.principal,
		},
		isNone: {
			Plug: ourUser.principal,
			Quesiton: otherUsers.firstUser.Principal,
			Answer: otherUsers.secondUser.Principal,
		},
		isNotLoggedIn: {
			Plug: ourUser.empty,
			Quesiton: otherUsers.firstUser.Principal,
			Answer: otherUsers.secondUser.Principal,
		},
	};

	const generateQuestion = (authorCombination) => {
		const Status = ["OPEN", "PICKANSWER", "DISPUTABLE", "DISPUTED", "CLOSED"];
		var questions: any = [];

		for (let i = 0; i < Status.length; i++) {
			for (const key in authorCombination) {
				var question: any = {
					winner: {
						author: {
							id: authorCombination[key].Answer,
							joined_date: 27721910,
							name: "Bob",
						},
						creation_date: 100,
						content:
							"Nostrud magna et officia duis eu ut. Excepteur anim dolor ullamco in proident laboris ipsum culpa commodo nostrud.",
						id: "qlxi6c-s7xxw-gl7ec-xglwv-fxgkc-zcjth-yym2d-bmgp2-eywo",
					},
					id: "0",
					reward: 100,
					title: "What is the meaning of life?",
					content: "What is the meaning of life?",
					status_end_date: 100,
					author_invoice: {
						id: "0",
						amount: 100,
						status: "paid",
						creation_date: 100,
						payment_date: 100,
						payment_method: "paypal",
						payment_transaction_id: "1",
					},
					close_transaction_block_height: [],
					open_duration: 100,
					creation_date: 100,
				};
				question.status = Status[i];
				question.author = {
					id: authorCombination[key].Quesiton,
					joined_date: "100",
					name: "john",
				};

				const answer1 = {
					author: {
						id: authorCombination[key].Answer,
					},
					creation_date: 100,
				};

				const answer2 = {
					author: {
						id: "aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaa",
					},
					creation_date: 100,
				};

				question.answers = [answer1, answer2];

				const answers = [
					{
						author: {
							id: authorCombination[key].Answer,
							joined_date: 27721910,
							name: "Bob",
						},
						creation_date: 100,
						content:
							"Nostrud magna et officia duis eu ut. Excepteur anim dolor ullamco in proident laboris ipsum culpa commodo nostrud.",
						id: "qlxi6c-s7xxw-gl7ec-xglwv-fxgkc-zcjth-yym2d-bmgp2-eywo",
					},
					{
						author: {
							id: "ooooo-ooooo-ooooo-ooooo-ooooo-ooooo-ooooo-ooooo-oooo",
							joined_date: 27721910,
							name: "Author 2",
						},
						creation_date: 100,
						content:
							"This is the second answer This is the second answerThis is the second answerThis is the second answer This is the second answer",
						id: "aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaa",
					},
				];
				questions.push({
					question,
					ourUser: authorCombination[key].Plug,
					answers,
				});
			}
		}
		return questions;
	};

	return generateQuestion(authorCombination);
};

export default QuestionGenerator;
/* 
QuestionType {
  'id' : string,
  'status' : QuestionStatusEnum,
  'reward' : number,
  'title' : string,
  'content' : string,
  'status_end_date' : number,
  'winner' : [] | [AnswerType],
  'author' : UserType,
  'author_invoice' : InvoiceType,
  'close_transaction_block_height' : [] | [string],
  'open_duration' : number,
  'creation_date' : number,
}
*/
