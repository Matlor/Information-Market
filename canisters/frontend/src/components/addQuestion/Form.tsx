import React from "react";
import Title from "./Title";
import Input from "./InputNumber";
import { SlateEditor, TollbarInstance } from "./SlateEditor";
import { IInputs, ISpecifications } from "../../screens/AddQuestion";
import Selector from "./Selector";
import Button from "../core/Button";
import { ArrowSmall } from "../core/Icons";

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
	/* 
	<div className="text-small">Reward</div>
						<div className="text-small">Duration</div>
						<div className="text-small">.</div>
	
	*/
	return (
		/* entire wrapper */
		<div className="flex flex-col gap-24 mt-10">
			<div className="flex items-end justify-between">
				{/* EACH WRAPPED */}

				<div>
					<div className="mb-1 text-small text-colorTextGrey">Reward</div>
					<Input
						setValue={dispatch.reward}
						Validity={{
							isValid: inputs.validation.validReward,
							invalidMessage: `Between ${specifications.reward.min} and ${specifications.reward.max} ICP`,
						}}
						unit={"ICP"}
						key="1"
					/>
				</div>

				<div>
					<div className="mb-1  text-small text-colorTextGrey">Duration</div>
					<Input
						setValue={dispatch.duration}
						Validity={{
							isValid: inputs.validation.validDuration,
							invalidMessage: `Between ${specifications.duration.min} and ${specifications.duration.max} min`,
						}}
						unit={"DAYS"}
						key="0"
					/>
				</div>
				<div>
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

			<Selector />

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
					<div className="mb-6 flex justify-between items-center">
						<TollbarInstance />

						<Button
							customButton={
								<button className="flex text-small font-600 text-colorIcon gap-4 items-center bg-colorLines rounded-lg py-[9px] px-3">
									<p>Submit</p> <ArrowSmall />
								</button>
							}
							propFunction={async () => {}}
						/>
					</div>
				</SlateEditor>
			</div>
		</div>
	);
};

export default FormView;
