import ProfileAnswers from "../../core/view/ProfileAnswers";
import parse from "html-react-parser";

const QuestionBody = ({
	reward,
	title,
	content,
	authorName,
	numberOfAnswers,
	date,
}) => {
	return (
		<div className="flex flex-col items-start gap-[20px] py-[36px] pr-[100px] pl-[61px] bg-colorBackgroundComponents shadow-md rounded-md">
			<div className="flex items-start heading2-20px bg-colorBackground px-[25px] py-[5px] rounded-md">
				{" "}
				{reward} ICP
			</div>

			<div className="heading3-18px"> {title}</div>

			<div className="text-14px text-justify"> {parse(content)}</div>

			<div className="flex justify-between items-center self-stretch gap-[15px] px-[0px] py-[10px]">
				<ProfileAnswers name={authorName} answers={numberOfAnswers} />
				<div className="text-small-12px">{date}</div>
			</div>
		</div>
	);
};

export default QuestionBody;
