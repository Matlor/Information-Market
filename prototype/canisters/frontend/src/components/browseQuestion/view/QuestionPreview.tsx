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
		<div className="flex justify-start items-start  py-[23px] pr-[48px] pl-[27px] gap-[46px] bg-colorBackgroundComponents shadow-md rounded-md">
			<div className="w-[95px] flex-none flex flex-col gap-[12px]">
				<div className="heading3-18px">{reward} ICP</div>
				<div className="text-14px ">{smallLetterConversion(status)}</div>
				<StagesBar status={status} />
			</div>

			<div className="border-colorLines border-l-[2px] w-0 self-stretch "></div>
			<div className="flex flex-col gap-[15px]">
				<Link to={`/question/${id}`}>
					<div className="heading3-18px">
						{title} erbvuerzbvurh jh ej jhre ejfh rejh jrej jrhe ejh
						erbvuerzbvurh jh ej jhre ejfh rejh jrej jrhe ejh erbvuerzbvurh jh ej
						jhre ejfh rejh jrej jrhe ejh erb
					</div>
				</Link>
				<ProfileAnswers
					name={authorName}
					answers={numAnswers}
					avatar={avatar}
				/>
			</div>
		</div>
	);
};

export default QuestionPreview;
