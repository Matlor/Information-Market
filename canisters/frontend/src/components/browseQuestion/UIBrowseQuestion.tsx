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
			return <div className="flex justify-center text-large">No Questions</div>;
		} else {
			return <>{children}</>;
		}
	};

	return (
		<div className="flex flex-col justify-between h-full">
			<div className="">
				<div className="flex justify-end gap-2 mt-6 mb-6 md:mt-8 md:mb-8">
					{/* <Search
						searchLoading={loading.search}
						setSearchedText={setSearchedText}
						className="border-1 px-2 h-[36px] w-[40px] flex justify-center items-center"
					/> */}

					<Sort
						isLoading={loading.filter}
						setSortOrder={setSortOrder}
						order={conditions.order}
						className="h-[36px] w-[40px] flex justify-center items-center"
					/>
					<OpenToggle
						isOn={
							!conditions?.status?.pickanswer &&
							!conditions?.status?.disputable &&
							!conditions?.status?.arbitration &&
							!conditions?.status?.payout &&
							!conditions?.status?.closed
						}
						onClick={toggleStatus}
						className="h-[36px] w-[40px] flex justify-center items-center"
					/>
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
			<div className="flex justify-center mt-7 md:mt-8">
				<Pagination
					pageIndex={conditions.pagination.pageIndex}
					questionsPerPage={conditions.pagination.questionsPerPage}
					totalQuestions={questionData.totalQuestions}
					setPageIndex={setPageIndex}
				/>
			</div>
		</div>
	);
};

export default UIBrowseQuestion;
