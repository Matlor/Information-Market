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
			className="flex flex-col items-start gap-[5px] px-[20px] py-[15px] bg-colorBackgroundComponents shadow-md rounded-lg"
			data-cy="QuestionBody"
		>
			<div className="heading2">{title}</div>

			<div className="editor-wrapper text-justify">{parse(content)}</div>

			<div className="flex items-center self-stretch gap-[30px] pt-[35px] px-[0px] py-[0px]">
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
