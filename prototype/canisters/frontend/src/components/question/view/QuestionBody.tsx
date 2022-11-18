import ProfileAnswers from "../../core/view/ProfileAnswers";
import parse from "html-react-parser";
import PostDate from "../../core/view/Date";

import Profile from "../../core/view/Profile";
import QuestionMetaData from "./QuestionMetaData";

const QuestionBody = ({
	status,
	endDateSec,
	reward,
	title,
	content,
	initiator,
	avatar,
	cachedAvatars,
	numberOfAnswers,
	date,
	winner,
}: any) => {
	return (
		<div
			className="flex flex-col items-start gap-[5px] p-content bg-colorBackgroundComponents shadow-lg rounded-lg"
			data-cy="QuestionBody"
		>
			<div className="max-w-[400px] w-full">
				<QuestionMetaData
					status={status}
					endDateSec={endDateSec}
					reward={reward}
					isTimeShown={true}
					isPayoutShown={true}
					winner={winner}
				/>
			</div>

			<div className="my-[25px]">
				<div className="heading3">
					{title.charAt(0).toUpperCase() + title.slice(1)}
				</div>
				<div className="editor-wrapper text-justify">{parse(content)}</div>
			</div>
			<div className="flex items-center self-stretch gap-[30px] px-[0px] py-[0px]">
				<Profile
					name={initiator.name}
					avatar={cachedAvatars.get(initiator.id)}
				/>
				<PostDate date={date} />
			</div>
		</div>
	);
};

export default QuestionBody;
