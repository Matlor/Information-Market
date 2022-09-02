import Title from "./Title";
import Input from "./Input";

const TitleBar = ({
	title,
	setTitle,
	duration,
	setDuration,
	reward,
	setReward,
}) => {
	return (
		<div className="flex justify-between gap-[17px] p-0">
			<Title value={title} setValue={setTitle} placeholder={"Title..."} />

			<div className="flex justify-between gap-[17px]">
				<Input
					value={duration}
					setValue={setDuration}
					placeholder={"Duration"}
					unit={"Min"}
					type={"number"}
					key="0"
				/>
				<Input
					value={reward}
					setValue={setReward}
					placeholder={"Reward"}
					unit={"ICP"}
					type={"number"}
					key="1"
				/>
			</div>
		</div>
	);
};

export default TitleBar;
