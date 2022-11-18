import { Link } from "react-router-dom";
import Profile from "../../core/view/Profile";
import StagesBar from "./StagesBar";
import Date from "../../core/view/Date";
import { questionStatusToString } from "../../core/services/utils/conversions";
import QuestionMetaData from "../../question/view/QuestionMetaData";

const QuestionPreview = ({
	reward,
	status,
	id,
	title,
	authorName,
	numAnswers,
	avatar,
	date,
}) => {
	const metaInformationLargeScreen = (
		<div className="w-[120px] flex flex-col gap-normal items-end">
			<div className="heading3">{reward} ICP</div>

			<div>
				<div className="float-right text-normal mb-2">
					{questionStatusToString(status)}
				</div>
				<div className="float-right">
					<StagesBar status={status} />
				</div>
			</div>
		</div>
	);

	const content = (
		<>
			<div className="flex-1 min-h-full flex flex-col justify-between">
				<Link to={`/question/${id}`}>
					<div className="heading3">
						{title.charAt(0).toUpperCase() + title.slice(1)}
					</div>
				</Link>
				<div className="flex self-stretch mt-[20px]">
					<Profile name={authorName} avatar={avatar} />
					<div className="self-center">
						<Date date={date} />
					</div>
				</div>
			</div>
		</>
	);

	return (
		<>
			<div className="visible md:hidden">
				<div className="p-content bg-colorBackgroundComponents shadow-md rounded-lg">
					<div className="mb-10  ">
						<QuestionMetaData
							status={status}
							reward={reward}
							isTimeShown={false}
						/>
					</div>
					{content}
				</div>
			</div>
			<div className="hidden md:block">
				<div className="w-full min-h-[150px] flex justify-between p-content  gap-[45px] bg-colorBackgroundComponents shadow-md rounded-lg">
					{content}
					<div className="border-colorBackground border-l-[2px] w-0 self-stretch rounded-full "></div>
					{metaInformationLargeScreen}
				</div>
			</div>
		</>
	);
};

export default QuestionPreview;
