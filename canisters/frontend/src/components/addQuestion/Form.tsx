import React, { useContext } from "react";
import TitleInput from "./TitleInput";
import { SlateEditor, TollbarInstance, EditableInstance } from "./SlateEditor";
import { IInputs, ISpecifications } from "../../screens/AddQuestion";
import { LoadingWrapper } from "../core/Button";
import { ActorContext } from "../api/Context";
import { Slider } from "./Slider";
import { FormatDuration } from "../core/Time";
import { SubmitStages } from "../../screens/AddQuestion";
import { ShowStages } from "./Stages";

import { List } from "../app/Layout";
import { ArrowIcon } from "../core/Icons";

interface IForm {
	inputs: IInputs;
	specifications: ISpecifications;
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

	const SubmitButton = ({ isActive = false }) => {
		return (
			<LoadingWrapper onClick={submit} isLoading={isSubmitting}>
				<div className="flex items-center gap-3 cursor-pointer">
					<div className="flex items-center  px-[25px] py-[8px] bg-gray-100 rounded-full w-max">
						<div
							className={`w-3 h-[1px] my-3 -mr-1  ${
								isActive ? "bg-black" : "bg-gray-500"
							}`}
						></div>
						<ArrowIcon
							size={10}
							strokeWidth={2}
							borderColor={isActive ? "black" : "gray-500"}
						/>
					</div>
				</div>
			</LoadingWrapper>
		);
	};

	const ErrorTag = ({ children }) => {
		return (
			<div className="flex gap-4 px-4 py-2 text-gray-500 bg-gray-100 w-max rounded-1 text-small">
				{children}
			</div>
		);
	};

	const { validDuration, validReward, validTitle } = inputs.validation;

	const loggedIn = user?.principal;
	const validInputs = validDuration && validReward && validTitle;
	const isError = submitStages === "error";

	console.log(validInputs, "validInputs");

	const Action = () => {
		if (!validInputs) {
			return <></>;
		} else if (!loggedIn) {
			return <ErrorTag>Login to submit </ErrorTag>;
		} else {
			if (submitStages === null || submitStages === "error") {
				return <SubmitButton isActive={true} />;
			} else if (
				submitStages === "invoice" ||
				submitStages === "transfer" ||
				submitStages === "submit" ||
				submitStages === "success"
			) {
				return (
					<div className="flex justify-end w-full ">
						<div className="flex items-center justify-end w-full gap-5">
							{/* <ErrorTag>
									<SubmitStagesText stages={submitStages} />
								</ErrorTag> */}
							<ShowStages stages={submitStages} />
						</div>
					</div>
				);
			} else {
				return <></>;
			}
		}
	};

	const { days, hours } = FormatDuration(inputs.duration);

	const NumberComponent = ({ number }) => {
		const digits = number.split("");
		return (
			<>
				{digits.map((digit, index) => (
					<div
						key={index}
						className="w-[10px] h-full flex justify-center text-small text-black "
					>
						{digit}
					</div>
				))}
			</>
		);
	};

	return (
		<List>
			<div className="flex flex-col w-[350px] mt-[80px] self-center p-2 items-center gap-5  ">
				<div className="space-y-[20px] w-full">
					<div className="flex w-full gap-2 text-black text-small">
						<div className="flex justify-end w-1/2">
							<NumberComponent number={inputs?.reward?.toFixed(2)} />
						</div>
						<div className="w-1/2">ICP</div>
					</div>

					<Slider
						value={inputs.reward}
						onChange={dispatch.reward}
						min={specifications.reward.min}
						max={specifications.reward.max}
						step={0.05}
						disabled={isSubmitting}
					/>
				</div>

				<div className="space-y-[20px] w-full">
					<div className="flex w-full gap-5 text-black text-small">
						<div className="w-1/2 ">
							<div className="flex float-right ">
								<div className="w-[20px text-left text-black">{days}</div>
								<div className="ml-1">Days</div>
							</div>
						</div>

						<div className="w-1/2">
							<div className="flex float-left">
								<div className="w-[18px] text-left text-black">
									{String(hours).padStart(2, "0")}
								</div>
								<div className="ml-1">Hours</div>
							</div>
						</div>
					</div>

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

			<div className="space-y-1">
				<div className="flex items-center h-6 rounded-1 text-small">
					<div className="w-9 text-[#8B8B8B] flex gap-2">
						<div>{inputs?.title?.length ? inputs.title.length : 0} </div>{" "}
						<div>/</div>
						<div>{specifications.title.max}</div>
					</div>
					{!validTitle && inputs.title.length > 0 ? (
						<div className="px-2 py-1 bg-gray-100 text-extra-small">
							{"  20 or more "}
						</div>
					) : (
						<></>
					)}
				</div>

				<TitleInput
					value={inputs.title}
					setValue={dispatch.title}
					placeholder={"How does the Internet Computer Protocol work?"}
					maxLength={specifications.title.max}
					disabled={isSubmitting}
					className="min-h-[27.5px]"
				/>
			</div>
			<div className="">
				<SlateEditor
					inputValue={inputs.content}
					setInputValue={dispatch.content}
					className="min-h-[125px]  "
				>
					<div className="flex items-center justify-between mb-3">
						<TollbarInstance className="gap-4" />
					</div>

					<EditableInstance
						placeholder="I would like to understand what makes the ICP more scalable than other blockchains."
						disabled={isSubmitting}
						className="h-full text-[#484B57]"
					/>
				</SlateEditor>

				<div className="flex items-center justify-end w-full mt-3 border-black h-7">
					<Action />
				</div>

				{isError && (
					<div className="flex items-center justify-between gap-4 px-4 py-3 mt-6 bg-gray-100 border-gray-100 text-large rounded-2">
						<div className="font-500 ">An error occured</div>
						<div className="">Insufficient funds</div>
					</div>
				)}
			</div>
		</List>
	);
};
export default Form;
