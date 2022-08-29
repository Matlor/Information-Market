import { Link } from "react-router-dom";
import ProfileAnswers from "../core/ProfileAnswers";
import StagesBar from "./StagesBar";

const QuestionPreview = ({ question }) => {
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
				<div className="heading3-18px">{question.reward} ICP</div>
				<div className="text-14px ">
					{smallLetterConversion(question.status)}
				</div>
				<StagesBar status={question.status} />
			</div>

			<div className="h-fit">
				<svg
					width="2"
					height="121px"
					viewBox="0 0 2 121"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<line
						x1="1"
						y1="-4.43495e-08"
						x2="1.00001"
						y2="121"
						stroke="#CED8DE"
						strokeOpacity="0.8"
						strokeWidth="2"
					/>
				</svg>
			</div>
			<div className="flex flex-col gap-[12px]">
				<div className="heading3-18px">
					{question.title} erbvuerzbvurh jh ej jhre ejfh rejh jrej jrhe ejh
					erbvuerzbvurh jh ej jhre ejfh rejh jrej jrhe ejh erbvuerzbvurh jh ej
					jhre ejfh rejh jrej jrhe ejh erb
				</div>

				<ProfileAnswers
					name={question.author.name}
					answers={question.answers.length}
				/>
			</div>
		</div>
	);
};

export default QuestionPreview;
