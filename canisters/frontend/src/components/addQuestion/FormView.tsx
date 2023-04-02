import React, { useContext } from "react";
import Title from "./TitleInput";
import { SlateEditor, TollbarInstance } from "./SlateEditor";
import { IInputs, ISpecifications } from "../../screens/AddQuestion";
import Button from "../core/Button";
import { ActorContext } from "../api/Context";
import { Slider, SliderLabel } from "./Slider";
import { FormatDuration } from "../core/Time";

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

	return (
		<div className="flex flex-col mt-5 gap-14 ">
			{/* Sliders */}

			<div className="mb-0">
				{/* Slider 1 */}
				<div className="mb-8 -number">
					<SliderLabel
						left={"Reward"}
						right={<>{inputs.reward.toFixed(2)} ICP </>}
					/>

					<Slider
						value={inputs.reward}
						onChange={dispatch.reward}
						min={0.25}
						max={10}
						step={0.25}
					/>
				</div>

				{/* Slider 2 */}
				<div className="">
					<SliderLabel
						left={"Duration"}
						right={<>{FormatDuration(inputs.duration)} </>}
					/>
					<Slider
						value={inputs.duration}
						min={1}
						max={168}
						step={1}
						onChange={dispatch.duration}
					/>
				</div>
			</div>

			<div className="flex flex-col gap-12">
				<div className="relative">
					<div className="w-max ">
						<div className="flex w-max">
							{inputs.title.length ? inputs.title.length : 0} /{" "}
							{specifications.title.max}
						</div>
					</div>

					{!inputs.validation.validTitle && inputs.title ? (
						<div className="absolute flex justify-center w-max text-normal-small -top-10 ">
							{`Between  ${specifications.title.min} and ${specifications.title.max} letters`}
						</div>
					) : (
						<></>
					)}
					<Title
						value={inputs.title}
						setValue={dispatch.title}
						placeholder={titlePlaceholder}
						maxLength={specifications.title.max}
					/>
				</div>

				<div>
					<SlateEditor
						inputValue={inputs.content}
						setInputValue={dispatch.content}
						placeholder="Add your question here..."
					>
						<div className="flex items-center justify-between mb-2">
							<TollbarInstance />

							{user.principal ? (
								<Button propFunction={async () => {}} text="Submit" />
							) : (
								<div className="px-4 py-2 rounded-sm ">Login to Submit</div>
							)}
						</div>
					</SlateEditor>
				</div>
			</div>
		</div>
	);
};

export default FormView;

{
	/* <div className="px-4 py-2 rounded-sm ">
									Login to Submit
								</div> */
}
