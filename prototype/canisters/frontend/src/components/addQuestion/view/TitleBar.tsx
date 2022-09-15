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
}) => {
	return (
		<div className="flex justify-between gap-[17px] p-0">
			<Title
				value={title}
				setValue={setTitle}
				isError={isTitleError}
				minValue={minTitle}
				maxValue={maxTitle}
			/>
			<div className="flex justify-between gap-[17px]">
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
