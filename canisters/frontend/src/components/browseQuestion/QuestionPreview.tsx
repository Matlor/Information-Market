import React from "react";
import { Question as IQuestion } from "../../../declarations/market/market.did.d";
import { Principal } from "@dfinity/principal";
import { Link } from "react-router-dom";
import { Profile } from "../core/Profile";

import NumAnswers from "../browseQuestion/NumAnswers";
import { moStatusToString } from "../core/utils/conversions";
import { TimeLeft, TimeStamp } from "../core/Time";
import { RewardTag } from "../core/Tag";

import { OnStage } from "../question/Stages";
import { ClockIcon } from "../core/Icons";

export interface QuestionPreviewProps {
	question: IQuestion;
	author: {
		id: Principal;
		name: string;
	};
}

const QuestionPreview: React.FC<QuestionPreviewProps> = ({
	question,
	author,
}) => {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between">
				<div className="flex space-x-4">
					<Profile
						principal={author.id}
						/* minutes={question.creation_date} */
					/>
				</div>
				<div className="flex space-x-3 md:space-x-3 ">
					{moStatusToString(question.status) === "OPEN" && (
						<div className="flex items-center space-x-1 rounded-sm">
							<TimeLeft minutes={question.status_end_date} icon={false} />
							<OnStage isActive={true} size={16} />
						</div>
					)}
					<RewardTag reward={question.reward} />
				</div>
			</div>

			<div className="text-black text-large">
				{question.title.charAt(0).toUpperCase() + question.title.slice(1)}
			</div>
			<div className="flex gap-4 ">
				<NumAnswers number={question.answers.length} />

				<div className="flex items-center gap-1">
					{/* <ClockIcon size={10} fillColor="white" borderColor="gray-800" /> */}
					<TimeStamp
						minutes={question.creation_date}
						className="text-gray-400 text-extra-small font-400"
					/>
				</div>
			</div>
		</div>
	);
};

export default QuestionPreview;
