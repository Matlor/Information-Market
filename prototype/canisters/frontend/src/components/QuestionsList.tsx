import QuestionShort from "./QuestionShort";

const QuestionsList = ({ questions }: any) => {
	return (
		<div className="ml-72 mr-72 mt-14 mb-5">
			{questions.length > 0 ? (
				questions.map((q: any, index: number) => {
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
