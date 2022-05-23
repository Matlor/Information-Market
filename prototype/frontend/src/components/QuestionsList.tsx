import QuestionShort from "./QuestionShort";

const QuestionsList = ({ questions }: any) => {
	return (
		<div className="ml-72 mr-72 mt-14 mb-5">
			{Object.keys(questions[0]).length !== 0 ? (
				questions[0].map((q: any, index: number) => {
					return (
						<div key={index}>
							<QuestionShort question={q} key={Number(q.id)} />
						</div>
					);
				})
			) : (
				<div>No list</div>
			)}
		</div>
	);
};

export default QuestionsList;
