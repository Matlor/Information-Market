import ListWrapper from "../components/core/ListWrapper";
import FilterBar from "../components/browseQuestion/FilterBar.jsx";
import QuestionPreview from "../components/browseQuestion/QuestionPreview.jsx";
import Pagination from "../components/browseQuestion/Pagination.jsx";

import { useState } from "react";

const BrowseQuestion = () => {
	const [questions, setQuestions] = useState([]);

	return (
		<>
			<ListWrapper>
				{" "}
				<FilterBar />
				{questions.map((question) => (
					<QuestionPreview question={question} />
				))}
				<QuestionPreview /> <QuestionPreview /> <QuestionPreview />
			</ListWrapper>
			<Pagination />
		</>
	);
};

export default BrowseQuestion;
