import React, { useContext } from "react";
import TitleInput from "./TitleInput";
import { SlateEditor, TollbarInstance, EditableInstance } from "./SlateEditor";
import { IInputs, ISpecifications } from "../../screens/AddQuestion";
import Button, { LoadingWrapper } from "../core/Button";
import { ActorContext } from "../api/Context";
import { Slider } from "./Slider";
import { FormatDuration } from "../core/Time";
import { SubmitStages } from "../../screens/AddQuestion";
import { ShowStages } from "./Stages";
import { SubmitStagesText } from "./Stages";
import { initialInput } from "../../screens/AddQuestion";
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
					{/* <div className="text-large">submit</div> */}

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
			<div className="flex gap-4 px-4 py-2 text-gray-500 bg-gray-100 rounded-1 text-small">
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
		/* if (
			inputs.title === initialInput.title &&
			inputs.content === initialInput.content
		) {
			return <></>; */

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

	return (
		<List>
			<div className="flex flex-col items-start w-full gap-6 md:gap-10 md:flex-row">
				<div className="flex flex-col w-full gap-2">
					<div className="flex text-small ">
						{/* <div>{"Reward : "}</div> */}

						<div className="text-left w-7 font-600">
							{inputs?.reward?.toFixed(2)}{" "}
						</div>
						<div className="">ICP</div>
					</div>
					<div className="w-full">
						<Slider
							value={inputs.reward}
							onChange={dispatch.reward}
							min={specifications.reward.min}
							max={specifications.reward.max}
							step={0.01}
							disabled={isSubmitting}
						/>
					</div>
				</div>
				<div className="flex flex-col w-full gap-2">
					<div className="flex gap-6 text-small">
						<div className="flex">
							<div className="w-5 text-left font-600">{days}</div>
							<div className="ml-1">Days</div>
						</div>
						<div className="flex">
							<div className="w-5 text-left font-600">{hours}</div>
							<div className="ml-1">Hours</div>
						</div>
					</div>
					<div className="w-full">
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
			</div>

			{/* <div className="w-full h-[0.5px] bg-gray-800"></div> */}
			<div className="space-y-1 ">
				<div className="flex items-center h-6 rounded-1 text-small">
					<div className="w-9">
						{inputs?.title?.length ? inputs.title.length : 0} /{" "}
						{specifications.title.max}
					</div>
					{!validTitle && inputs.title.length > 0 ? (
						<div className="px-2 py-1 bg-gray-100 text-extra-small">
							{"  20 or more "}
						</div>
					) : (
						<></>
					)}
					{/* check for invaliud title */}
				</div>

				<TitleInput
					value={inputs.title}
					setValue={dispatch.title}
					placeholder={
						"How can one learn to build on the ICP, it seems rather diffult? "
					}
					maxLength={specifications.title.max}
					disabled={isSubmitting}
					className="min-h-[60px]"
				/>
			</div>
			<div>
				<SlateEditor
					inputValue={inputs.content}
					setInputValue={dispatch.content}
					className="min-h-[125px]  "
				>
					<div className="flex items-center justify-between mb-3">
						<TollbarInstance className="gap-5" />
					</div>

					<EditableInstance
						placeholder="What if you could anyone anything quickly? What if the global information exchange would not suck? And what if it was built on the ICP? ﻿What if you could anyone anything quickly? "
						disabled={isSubmitting}
						className="h-full "
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
/* 
else {
	if (isError) {
		return (
			<div className="flex items-center justify-between w-full gap-5 ">
				<div className="">
					{submitStages === "error" && (
						<ErrorTag>
			
							<div> Insufficient funds </div>
						</ErrorTag>
					)}
				</div>
				<SubmitButton isActive={true} />
			</div>
		); */

export default Form;

/* placeholder="Add your question here..."
					disabled={isSubmitting} */

{
	/* 					<div className="flex italic text-small ">Login to Submit</div>
	 */
}

// p-3 px-5 bg-gray-100 rounded-full opacity-50
/* 
			<div className="flex items-center justify-end w-full gap-5 text-small-large">
					<ErrorTag>Login to Submit </ErrorTag>{" "}
					<SubmitButton isActive={false} />
				</div>
			
			*/

{
	/* <Button
							onClick={submit}
							text="Submit"
							color={"none"}
							arrow={true}
							size={"lg"}
						/> */
}
{
	/* <LoadingWrapper onClick={submit} isLoading={isSubmitting}>
							<div className="flex items-center gap-3 cursor-pointer">
								<div className="flex items-center gap-4 px-[16px] py-[8px] bg-gray-100 rounded-full w-max">
									<div>Submit</div>

									<div className="w-6 h-[1px] my-3 bg-black"></div>
									<ArrowIcon size={14} />
								</div>
							</div>
						</LoadingWrapper> */
}
{
	/* <Button
							onClick={submit}
							text="Submit"
							color={"none"}
							arrow={true}
							size={"lg"}
						/> */
}
{
	/* <LoadingWrapper onClick={submit} isLoading={isSubmitting}>
							<div className="flex items-center gap-3 cursor-pointer">
								px-[12px] bg-gray-100
								<div className="flex items-center gap-4 px-[16px] bg-gray-100  py-[6px]  rounded-full w-max">
									<div>Submit</div>
									<div className="w-6 h-[1px] my-3 bg-black"></div>
									<ArrowIcon size={14} />
								</div>
							</div>
						</LoadingWrapper> */
}

{
	/* <div>
					{!inputs?.validation?.validTitle && inputs?.title ? (
						<div className="flex justify-center items-center italic w-max text-[#F0810F] text-extra-small -top-1">
							{` ${specifications.title.min}-${specifications.title.max} characters`}
						</div>
					) : (
						<></>
					)}
				</div> */
}
