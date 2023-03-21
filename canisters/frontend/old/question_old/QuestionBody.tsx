import React from "react";

const QuestionBody = ({ children }: any) => {
	return (
		<div
			className="flex flex-col items-start gap-[5px] p-content bg-colorBackgroundComponents shadow-lg rounded-lg"
			data-cy="QuestionBody"
		>
			{children}
		</div>
	);
};

export default QuestionBody;
