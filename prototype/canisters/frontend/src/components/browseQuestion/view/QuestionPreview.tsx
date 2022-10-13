import { Link } from "react-router-dom";

import ProfileAnswers from "../../core/view/ProfileAnswers";
import StagesBar from "./StagesBar";

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
	const smallLetterConversion = (status) => {
		switch (status) {
			case "OPEN":
				return "Open";
			case "PICKANSWER":
				return "Pick a Winner";
			case "DISPUTABLE":
				return "Disputable";
			case "DISPUTED":
				return "Arbitration";
			case "CLOSED":
				return "Closed";
			default:
				return 0;
		}
	};

	return (
		<div className="flex px-[20px] py-[15px] gap-[46px] bg-colorBackgroundComponents shadow-md rounded-lg">
			<div className="w-[95px] flex flex-col gap-[12px]">
				<div className="heading3">{reward} ICP</div>

				<div className="text-normal">
					{smallLetterConversion(status)}
					<StagesBar status={status} />
				</div>
			</div>

			<div className="border-colorBackground border-l-[4px] w-0 self-stretch rounded-full "></div>
			<div className="flex h-max flex-col gap-[12px] self-stretch">
				<Link to={`/question/${id}`}>
					<div className="heading3">{title}</div>
				</Link>
				<div className="flex self-stretch mt-[5px]">
					<ProfileAnswers
						name={authorName}
						answers={numAnswers}
						avatar={avatar}
					/>
				</div>
			</div>
		</div>
	);
};

export default QuestionPreview;
