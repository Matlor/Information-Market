import React from "react";
import Title from "./Title";
import Input from "./InputNumber";
import SlateEditor from "./SlateEditor";
import { IInputs, ISpecifications } from "../../screens/AddQuestion";

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
	return (
		<>
			<div className="flex flex-col sm:flex-row sm:justify-between gap-normal">
				<div className="border-10 border-r-colorText sm:w-1/2">
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
				</div>
				<div className="flex justify-between w-full sm:w-1/2  sm:justify-end  gap-[17px] ">
					<Input
						setValue={dispatch.duration}
						Validity={{
							isValid: inputs.validation.validDuration,
							invalidMessage: `Between ${specifications.duration.min} and ${specifications.duration.max} min`,
						}}
						unit={"Min"}
						key="0"
					/>

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
			</div>

			<SlateEditor
				inputValue={inputs.content}
				setInputValue={dispatch.content}
				placeholder="Add your question here..."
			/>
		</>
	);
};

export default FormView;
