import Title from "./Title";
import Input from "./InputNumber";

const TitleBar = ({
	duration,
	setDuration,
	isDurationError,
	minDuration,
	maxDuration,

	reward,
	setReward,
	isRewardError,
	minReward,
	maxReward,

	title,
	setTitle,
	isTitleError,
	minTitle,
	maxTitle,
	titlePlaceholder,
}) => {
	return (
		<div className="flex flex-col sm:flex-row sm:justify-between gap-normal">
			<div className="border-10 border-r-colorText sm:w-1/2">
				<Title
					value={title}
					setValue={setTitle}
					isError={isTitleError}
					minValue={minTitle}
					maxValue={maxTitle}
					placeholder={titlePlaceholder}
				/>
			</div>
			<div className="flex justify-between w-full sm:w-1/2  sm:justify-end  gap-[17px] ">
				<Input
					value={duration}
					setValue={setDuration}
					isError={isDurationError}
					minValue={minDuration}
					maxValue={maxDuration}
					unit={"Min"}
					key="0"
				/>

				<Input
					value={reward}
					setValue={setReward}
					isError={isRewardError}
					minValue={minReward}
					maxValue={maxReward}
					unit={"ICP"}
					key="1"
				/>
			</div>
		</div>
	);
};

export default TitleBar;
