import parse from "html-react-parser";
import Profile from "../../core/view/Profile";
import { graphQlToStrDate } from "../../core/services/utils/conversions";

const Answer = ({
	content,
	date,
	authorName,
	avatar,
	isChoice = false,
	choiceBorder = "",
	isHover = false,
	hoverBorder = "",
}: any) => {
	var border = "border-2 border-colorBackgroundComponents";
	if (isChoice) {
		border = choiceBorder;
	} else {
		if (isHover) {
			border = hoverBorder;
		}
	}

	return (
		<div
			className={`${border} flex flex-col gap-[17px] py-[36px] pl-[61px] pr-[100px] shadow-md rounded-md bg-colorBackgroundComponents text-14px text-justify`}
		>
			<div className="text-14px text-justify editor-wrapper">
				{parse(content)}
			</div>

			<div className="flex flex-row justify-between items-center py-[10px] text-small-12px">
				<Profile name={authorName} avatar={avatar} />
				<div>{graphQlToStrDate(date)}</div>
			</div>
		</div>
	);
};

export default Answer;
