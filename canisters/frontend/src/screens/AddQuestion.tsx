import React from "react";
import { useEffect, useState, useReducer, useContext } from "react";
import { List } from "../components/app/Layout";
import Form from "../components/addQuestion/Form";
import { e8sToIcp } from "../components/core/utils/conversions";
import { ActorContext } from "../components/api/Context";
import { LoginToSubmitTag } from "../components/core/Tag";

import {
	createInvoice,
	transfer,
	createQuestion,
} from "../components/addQuestion/Submit";

/* 
Whole thing is 2 machines. Logged in or not, valid or not. 
If both true, then the UI can trigger the submit function.
But it should only have it in the first place if both are true.

*/

export type SubmitStages =
	| null
	| "invoice"
	| "transfer"
	| "submit"
	| "success"
	| "error";

export const doValidation = (inputs, specifications) => {
	const isBetween = (max, value, min) => {
		return value >= min && value <= max;
	};
	var validation = {
		validTitle: false,
		validDuration: false,
		validReward: false,
	};
	if (
		isBetween(
			specifications.title.max,
			inputs.title.length,
			specifications.title.min
		)
	) {
		validation.validTitle = true;
	}
	if (
		isBetween(
			specifications.duration.max,
			inputs.duration,
			specifications.duration.min
		)
	) {
		validation.validDuration = true;
	}
	if (
		isBetween(
			specifications.reward.max,
			inputs.reward,
			specifications.reward.min
		) &&
		inputs.reward
	) {
		validation.validReward = true;
	}
	return validation;
};

const isValid = (validation: IInputs["validation"]) => {
	return validation.validTitle &&
		validation.validDuration &&
		validation.validReward
		? true
		: false;
};

export interface IInputs {
	validation: {
		validTitle: boolean;
		validDuration: boolean;
		validReward: boolean;
	};
	title: string;
	duration: number;
	reward: number | undefined;
	content: string;
}

export interface ISpecifications {
	title: {
		min: number;
		max: number;
	};
	duration: {
		min: number;
		max: number;
	};
	reward: {
		min: number | undefined;
		max: number;
	};
}

// ------------------------------ Specifications -------------------------------
// TODO: This is not based on backend
const specifications: ISpecifications = {
	title: {
		max: 300,
		min: 20,
	},
	duration: {
		max: 168,
		min: 1,
	},
	reward: {
		max: 10,
		min: 0.25,
	},
};

export const initialInput: IInputs = {
	validation: {
		validTitle: false,
		validDuration: false,
		validReward: false,
	},
	title: "",
	content: "",
	duration: 24,
	reward: 1,
};

const AddQuestion = () => {
	// --------------------  Context --------------------
	const { user } = useContext(ActorContext);

	// -------------- State --------------

	const inputsReducer = (state: IInputs, action): IInputs => {
		setSubmitStages(null);

		switch (action.type) {
			case "reset":
				return initialInput;
			case "title":
				return {
					...state,
					title: action.payload,
					validation: doValidation(
						{ ...state, title: action.payload },
						specifications
					),
				};
			case "duration":
				return {
					...state,
					duration: action.payload,
					validation: doValidation(
						{ ...state, duration: action.payload },
						specifications
					),
				};
			case "reward":
				return {
					...state,
					reward: action.payload,
					validation: doValidation(
						{ ...state, reward: action.payload },
						specifications
					),
				};
			case "content":
				return {
					...state,
					content: action.payload,
					validation: doValidation(
						{ ...state, content: action.payload },
						specifications
					),
				};
			default:
				return {
					...state,
				};
		}
	};

	const [submitStages, setSubmitStages] = useState<SubmitStages>(null);

	const [inputs, dispatch] = useReducer(inputsReducer, initialInput);

	const submit = async (loggedInUser, inputs) => {
		try {
			setSubmitStages("invoice");
			const invoice = await createInvoice(loggedInUser, inputs);
			console.log(invoice, "invoice");

			setSubmitStages("transfer");
			console.log(await transfer(loggedInUser, invoice), "transfer");

			setSubmitStages("submit");
			console.log(
				await createQuestion(loggedInUser, invoice.id, inputs),
				"createQuestion"
			);
			setSubmitStages("success");
			dispatch({ type: "reset" });
		} catch (err) {
			console.log("Error in submit function:", err);
			setSubmitStages("error");
		}
	};

	return (
		<List>
			<Form
				dispatch={{
					reward: (reward) => {
						dispatch({ type: "reward", payload: reward });
					},
					duration: (duration) => {
						dispatch({ type: "duration", payload: duration });
					},
					title: (title) => {
						dispatch({ type: "title", payload: title });
					},
					content: (content) => {
						dispatch({ type: "content", payload: content });
					},
				}}
				inputs={inputs}
				specifications={specifications}
				submitStages={submitStages}
				submit={
					isValid(inputs.validation) && user.principal
						? () => submit(user, inputs)
						: null
				}
			/>
		</List>
	);
};

export default AddQuestion;
