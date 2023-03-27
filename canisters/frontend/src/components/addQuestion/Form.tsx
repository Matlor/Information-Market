import React, { useContext } from "react";
import Title from "./TitleInput";
import Input from "./InputNumber";
import { SlateEditor, TollbarInstance } from "./SlateEditor";
import { IInputs, ISpecifications } from "../../screens/AddQuestion";
import Selector from "./Selector";
import { ArrowButton } from "../core/Button";
import TimePicker from "./TimePicker";
import { ActorContext } from "../api/Context";
import { UIArrowButtonFilled } from "../core/Button";
import TestInput from "./TestInput";
import Slider from "./Slider";

interface IForm {
	inputs: IInputs;
	specifications: ISpecifications;
	titlePlaceholder: string;
	dispatch: {
		title: (value: string) => void;
		duration: (value: number) => void;
		reward: (value: number) => void;
		content: (value: string) => void;
	};
}

const FormView = ({
	inputs,
	specifications,
	titlePlaceholder,
	dispatch,
}: IForm) => {
	const { user, login } = useContext(ActorContext);
	console.log("inputs", inputs);

	// TODO: put to time file
	function formatDuration(duration) {
		if (duration < 24) {
			return `${duration} hours`;
		} else {
			const days = Math.floor(duration / 24);
			const hours = duration % 24;
			if (hours === 0) {
				return `${days} day${days > 1 ? "s" : ""}`;
			} else {
				return `${days} day${days > 1 ? "s" : ""}  ${hours} hour${
					hours > 1 ? "s" : ""
				}`;
			}
		}
	}

	return (
		<div className="flex flex-col gap-14 mt-5 ">
			{/* Sliders */}
			<div className="mb-0">
				{/* Slider 1 */}
				<div className="text-small-number mb-8">
					<Slider
						value={inputs.reward}
						min={0.25}
						max={10}
						step={0.25}
						onChange={dispatch.reward}
						label={
							<div className="flex justify-between gap-4 mb-5">Reward</div>
						}
						displayValue={<div>{inputs.reward.toFixed(2)} ICP</div>}
					/>
				</div>

				{/* Slider 2 */}
				<div className=" text-small-number">
					<Slider
						value={inputs.duration}
						min={1}
						max={168}
						step={1}
						onChange={dispatch.duration}
						label={
							<div className="flex justify-between gap-4 mb-5">Duration</div>
						}
						displayValue={<div>{formatDuration(inputs.duration)}</div>}
					/>
				</div>
			</div>

			<div className="flex flex-col gap-12">
				<Title
					value={inputs.title}
					setValue={dispatch.title}
					Validity={{
						isValid: inputs.validation.validTitle,
						invalidMessage: `Between  ${specifications.title.min} and ${specifications.title.max} letters`,
					}}
					placeholder={titlePlaceholder}
					maxLength={specifications.title.max}
				/>

				<div>
					<SlateEditor
						inputValue={inputs.content}
						setInputValue={dispatch.content}
						placeholder="Add your question here..."
					>
						<div className="mb-2 flex justify-between items-center">
							<TollbarInstance />

							{user.principal ? (
								<ArrowButton propFunction={async () => {}} text="Submit" />
							) : (
								<div className="text-small px-4 py-2 rounded-sm bg-colorLines">
									Login to Submit
								</div>
							)}
						</div>
					</SlateEditor>
				</div>
			</div>
		</div>
	);
};

{
	/* <div className="text-small  px-4 py-2 rounded-sm bg-colorLines">
									Login to Submit
								</div> */
}

export default FormView;

{
	/*	<Selector /> */
}
{
	/* <div className="flex ">
					<TimePicker />
				</div>
 */
}

/* 

<TestInput value={inputs.reward} setValue={dispatch.reward} />
			<div className="flex items-end gap-10">
			
				<div className="">
					<div className="mb-1 text-extrasmall-number text-colorTextGrey">
						Reward
					</div>
					<Input
						setValue={dispatch.reward}
						Validity={{
							isValid: inputs.validation.validReward,
							invalidMessage: `Between ${specifications.reward.min} and ${specifications.reward.max} ICP`,
						}}
						unit={"ICP"}
						value={inputs.reward}
						key="1"
					/>
				</div>

				<div className=" ">
					<div className="mb-1 text-extrasmall-number text-colorTextGrey">
						Duration
					</div>
					<div className="flex">
						<Input
							setValue={dispatch.duration}
							Validity={{
								isValid: inputs.validation.validDuration,
								invalidMessage: `Between ${specifications.duration.min} and ${specifications.duration.max} min`,
							}}
							unit={"DAYS"}
							key="0"
						/>

						<Input
							setValue={dispatch.duration}
							Validity={{
								isValid: inputs.validation.validDuration,
								invalidMessage: `Between ${specifications.duration.min} and ${specifications.duration.max} min`,
							}}
							unit={"HOURS"}
							key="0"
						/>
					</div>
				</div>
			</div>

			<Selector value={inputs.reward} setValue={dispatch.reward} />






*/

{
	/* thing */
}
{
	/* <div className="flex items-center justify-center">
					<div className="flex flex-col items-center mx-4">
						<div className="text-xl font-bold mb-2">Days</div>
						<div className="w-20 h-32 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden relative">
							<div className="text-4xl font-bold absolute top-1/2 transform -translate-y-1/2">
								5
							</div>
						</div>
					</div>
					<div className="flex flex-col items-center mx-4">
						<div className="text-xl font-bold mb-2">Hours</div>
						<div className="w-20 h-32 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden relative">
							<div className="text-4xl font-bold absolute top-1/2 transform -translate-y-1/2">
								12
							</div>
						</div>
					</div>
				</div> */
}

{
	/* Increment and Decrement */
}
{
	/* 	<div className="flex flex-col items-center">
					<div className="reward-section mb-8">
						<h2 className="text-2xl font-bold mb-4">Reward</h2>
						<div className="flex items-center justify-center">
							<button className="px-4 py-2 text-xl font-bold bg-indigo-500 text-white rounded-full shadow-md">
								-
							</button>
							<div className="circular-slider-container mx-4">
								<span className="value-display text-4xl font-bold">50</span>
							</div>
							<button className="px-4 py-2 text-xl font-bold bg-indigo-500 text-white rounded-full shadow-md">
								+
							</button>
						</div>
					</div>

					<div className="timeframe-section">
						<h2 className="text-2xl font-bold mb-4">Time Frame</h2>
						<div className="flex items-center justify-center">
							<button className="px-4 py-2 text-xl font-bold bg-indigo-500 text-white rounded-full shadow-md">
								-
							</button>
							<div className="circular-slider-container mx-4">
								<span className="value-display text-4xl font-bold">
									24 hours
								</span>
							</div>
							<button className="px-4 py-2 text-xl font-bold bg-indigo-500 text-white rounded-full shadow-md">
								+
							</button>
						</div>
					</div>
				</div> */
}
{
	/* EACH WRAPPED */
}
