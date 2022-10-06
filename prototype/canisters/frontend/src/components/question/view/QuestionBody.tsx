import ProfileAnswers from "../../core/view/ProfileAnswers";
import parse from "html-react-parser";

import { graphQlToStrDate } from "../../core/services/utils/conversions";

import Date from "../../core/view/Date";

const QuestionBody = ({
	title,
	content,
	authorName,
	avatar,
	numberOfAnswers,
	date,
}: any) => {
	return (
		<div
			className="flex flex-col items-start gap-[20px] py-[30px] pr-[48px] pl-[35px] bg-colorBackgroundComponents shadow-md rounded-lg"
			data-cy="QuestionBody"
		>
			<div className="heading2">{title}</div>

			<div className="editor-wrapper text-justify">{parse(content)}</div>

			<div className="flex items-center self-stretch gap-[30px] px-[0px] py-[10px]">
				<ProfileAnswers
					name={authorName}
					answers={numberOfAnswers}
					avatar={avatar}
				/>
				<Date date={graphQlToStrDate(date)} />
			</div>
		</div>
	);
};

export default QuestionBody;
