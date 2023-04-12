import React from "react";
import { Meta, Story } from "@storybook/react";
import { TimeLeft, TimeStamp } from "../../components/core/Time";

export default {
	title: "core/Time",
	argTypes: {
		minutes: {
			control: { type: "number" },
		},
		icon: {
			control: { type: "boolean" },
		},
	},
} as Meta;

const now = Math.floor(Date.now() / 1000) / 60;

const CurrentTimeInMinutes = ({ passedTime }) => {
	const [currentTimeInMinutes, setCurrentTimeInMinutes] = React.useState(
		Math.floor(Date.now() / 1000) / 60
	);

	React.useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTimeInMinutes(Math.floor(Date.now() / 1000) / 60);
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	const timeDifference = (currentTimeInMinutes - passedTime()).toFixed(2);

	return (
		<div className="mb-6 text-small">
			<div>Current time in minutes: {currentTimeInMinutes.toFixed(2)}</div>
			<div>Passed time in minutes: {passedTime().toFixed(2)}</div>
			<div>Time difference in minutes: {timeDifference}</div>
		</div>
	);
};

export const CombinedStory: Story = (args) => {
	const [rerender, setRerender] = React.useState(false);

	React.useEffect(() => {
		const interval = setInterval(() => {
			setRerender((prev) => !prev);
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	return (
		<>
			<CurrentTimeInMinutes passedTime={() => args.minutes} />
			<div className="flex gap-10">
				<div>
					<div className="mb-1 text-small">Time Left</div>
					{<TimeLeft {...args} icon={args.icon} />}
				</div>
				<div>
					<div className="mb-1 text-small">Time Stamp</div>
					<TimeStamp {...args} />
				</div>
			</div>
		</>
	);
};

CombinedStory.args = {
	minutes: now + 10,
	icon: true,
};
