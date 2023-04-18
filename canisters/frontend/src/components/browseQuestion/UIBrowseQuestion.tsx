import React from "react";
import Search from "./Search";
import Pagination from "./Pagination";
import Loading from "../core/Loading";
import { Link } from "react-router-dom";
import { Sort } from "./Sort";
import OpenToggle from "./OpenToggle";
import { List } from "../app/Layout";
import QuestionPreview from "./QuestionPreview";

const UIBrowseQuestion = ({
	questionData,
	loading,
	conditions,
	setSearchedText,
	setSortOrder,
	toggleStatus,
	setPageIndex,
}) => {
	const ViewState = ({ children }) => {
		if (loading.main) {
			return (
				<div className="flex items-center justify-center w-full h-40">
					<Loading />
				</div>
			);
		} else if (questionData.totalQuestions === 0) {
			return (
				<div className="flex items-center justify-center w-full h-40 text-large font-300"></div>
			);
		} else {
			return <>{children}</>;
		}
	};

	return (
		<>
			<div>
				<div className="flex justify-between pb-5 mb-8 border-gray-200 md:mt-6 md:mb-8 border-b-1">
					<Search
						searchLoading={loading.search}
						setSearchedText={setSearchedText}
					/>
					<div className="flex gap-5 lg:gap-7">
						<OpenToggle
							isOn={
								!conditions?.status?.pickanswer &&
								!conditions?.status?.disputable &&
								!conditions?.status?.arbitration &&
								!conditions?.status?.payout &&
								!conditions?.status?.closed
							}
							onClick={toggleStatus}
						/>
						<Sort
							isLoading={loading.filter}
							setSortOrder={setSortOrder}
							order={conditions.order}
						/>
					</div>
				</div>
				<List>
					<ViewState>
						{questionData.questions.map((questionAndAuthor: any, index) => {
							const { question, author } = questionAndAuthor;
							console.log(author, "author");
							return (
								<Link to={`/question/${question.id}`} key={question.id}>
									<QuestionPreview
										key={question.id}
										question={question}
										author={author}
									/>
								</Link>
							);
						})}
					</ViewState>
				</List>
			</div>
			<div className="flex justify-center">
				<Pagination
					pageIndex={conditions.pagination.pageIndex}
					questionsPerPage={conditions.pagination.questionsPerPage}
					totalQuestions={questionData.totalQuestions}
					setPageIndex={setPageIndex}
				/>
			</div>
		</>
	);
};

export default UIBrowseQuestion;
