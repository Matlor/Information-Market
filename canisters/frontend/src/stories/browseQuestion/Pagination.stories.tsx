import React, { useState } from "react";
import Pagination from "../../components/browseQuestion/Pagination";

export default {
	title: "browseQuestion/Pagination",
	component: Pagination,
};

const Template = (args) => {
	const [pageIndex, setPageIndex] = useState(0);
	const { questionsPerPage, totalQuestions } = args;

	return (
		<Pagination
			pageIndex={pageIndex}
			questionsPerPage={questionsPerPage}
			totalQuestions={totalQuestions}
			setPageIndex={setPageIndex}
		/>
	);
};

export const Default = Template.bind({});
Default.args = {
	questionsPerPage: 10,
	totalQuestions: 100,
};
