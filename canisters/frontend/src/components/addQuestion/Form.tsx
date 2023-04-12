import React, { useContext } from "react";
import TitleInput from "./TitleInput";
import { SlateEditor, TollbarInstance, EditableInstance } from "./SlateEditor";
import { IInputs, ISpecifications } from "../../screens/AddQuestion";
import Button from "../core/Button";
import { ActorContext } from "../api/Context";
import { Slider, SliderLabel } from "./Slider";
import { FormatDuration } from "../core/Time";
import { SubmitStages } from "../../screens/AddQuestion";
import { ShowStages } from "./Stages";
import { SubmitStagesText } from "./Stages";

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
	submitStages: SubmitStages;
	submit: any;
}

const Form = ({
	inputs,
	specifications,
	titlePlaceholder,
	dispatch,
	submitStages,
	submit,
}: IForm) => {
	const { user } = useContext(ActorContext);

	console.log(inputs);

	const isSubmitting =
		submitStages === "invoice" ||
		submitStages === "transfer" ||
		submitStages === "submit";

	const Action = () => {
		const { validDuration, validReward, validTitle } = inputs.validation;

		if (!user?.principal) {
			return <div className="italic text-large">Login to Submit</div>;
		} else if (!validDuration || !validReward || !validTitle) {
			return (
				<div className="italic text-large">Fill out the form correctly</div>
			);
		} else if (validDuration && validReward && validTitle) {
			if (!submitStages || submitStages === "error") {
				return (
					<div className="flex items-center justify-between ">
						<Button
							onClick={submit}
							text="Submit"
							color={"black"}
							arrow={true}
							size={"sm"}
						/>
						{submitStages === "error" && (
							<div className="italic text-red text-small">
								Something went wrong
							</div>
						)}
					</div>
				);
			} else {
				return (
					<div className="flex items-center gap-3">
						<ShowStages stages={submitStages} />
						<SubmitStagesText stages={submitStages} />
					</div>
				);
			}
		} else {
			return <></>;
		}
	};

	return (
		<>
			<div className="flex w-full gap-10">
				<div className="w-full space-y-6">
					<SliderLabel
						left={"Reward"}
						right={<>{inputs?.reward?.toFixed(2)} ICP </>}
					/>
					<Slider
						value={inputs.reward}
						onChange={dispatch.reward}
						min={specifications.reward.min}
						max={specifications.reward.max}
						step={0.01}
						disabled={isSubmitting}
					/>
				</div>
				<div className="w-full space-y-6">
					<SliderLabel
						left={"Duration"}
						right={<>{FormatDuration(inputs.duration)} </>}
					/>
					<Slider
						value={inputs.duration}
						min={specifications.duration.min}
						max={specifications.duration.max}
						step={1}
						onChange={dispatch.duration}
						disabled={isSubmitting}
					/>
				</div>
			</div>

			<div>
				<div className="flex items-center justify-between text-small">
					{inputs?.title?.length ? inputs.title.length : 0} /{" "}
					{specifications.title.max}
					<div>
						{!inputs?.validation?.validTitle && inputs?.title ? (
							<div className="flex justify-center italic w-max text-red -top-1">
								{`${specifications.title.min}-${specifications.title.max} characters`}
							</div>
						) : (
							<></>
						)}
					</div>
				</div>
				<TitleInput
					value={inputs.title}
					setValue={dispatch.title}
					placeholder={titlePlaceholder}
					maxLength={specifications.title.max}
					disabled={isSubmitting}
				/>
			</div>

			<div className="">
				<SlateEditor
					setInputValue={dispatch.content}
					/* placeholder="Add your question here..."
					disabled={isSubmitting} */
				>
					<div className="flex items-center justify-between mb-4">
						<TollbarInstance />
					</div>
					<EditableInstance
						placeholder="Add your question here..."
						disabled={isSubmitting}
					/>
				</SlateEditor>
			</div>

			<Action />
		</>
	);
};

export default Form;
