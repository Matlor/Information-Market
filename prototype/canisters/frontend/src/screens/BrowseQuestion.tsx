import ListWrapper from "../components/core/ListWrapper";
import FilterBar from "../components/browseQuestion/FilterBar.jsx";
import QuestionPreview from "../components/browseQuestion/QuestionPreview.jsx";
import Pagination from "../components/browseQuestion/Pagination.jsx";

import { useState, useEffect } from "react";
import avatar from "../components/core/avatar";

// This could be directly imported by the avatars component
import { gql, sudograph } from "sudograph";

const BrowseQuestion = ({ plug }) => {
	const [questions, setQuestions] = useState([]);

	/* AVATARS */
	const [cachedAvatars, setCachedAvatars] = useState<any>(() => new Map());

	// Load the list of avatars in the cache
	useEffect(() => {
		avatar.loadAvatars(
			questions,
			cachedAvatars,
			setCachedAvatars,
			sudograph,
			gql
		);
	}, [questions]);

	// TO DO:
	// pass avatars to the QuestionPreview component
	// change preview component to use the avatars

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
