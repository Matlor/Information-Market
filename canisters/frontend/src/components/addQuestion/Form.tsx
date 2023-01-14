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
						Error={{
							isError: !inputs.validation.validTitle,
							message: `Between  ${specifications.title.min} and ${specifications.title.max} letters`,
						}}
						maxLength={specifications.title.max}
						placeholder={titlePlaceholder}
					/>
				</div>
				<div className="flex justify-between w-full sm:w-1/2  sm:justify-end  gap-[17px] ">
					<Input
						value={inputs.duration}
						setValue={dispatch.duration}
						Error={{
							isError: !inputs.validation.validDuration,
							message: `Between ${specifications.duration.min} and ${specifications.duration.max} min`,
						}}
						unit={"Min"}
						key="0"
					/>

					<Input
						value={inputs.reward}
						setValue={dispatch.reward}
						Error={{
							isError: !inputs.validation.validReward,
							message: `Between ${specifications.reward.min} and ${specifications.reward.max} ICP`,
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
