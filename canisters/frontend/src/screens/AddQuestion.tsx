import React from "react";
import { useEffect, useState, useReducer, useContext } from "react";
import ListWrapper from "../components/core/ListWrapper";
import Submit from "../components/addQuestion/Submit";
import Form from "../components/addQuestion/Form";
import { e8sToIcp } from "../components/core/utils/conversions";
import { ActorContext } from "../components/api/Context";

const doValidation = (inputs, specifications) => {
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
	reward: number;
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

const AddQuestion = () => {
	// --------------------  Context --------------------
	const { user } = useContext(ActorContext);

	// ------------------------------ Specifications -------------------------------
	// TODO: visually show that min reward is fetched
	const [specifications, setSpecifications] = useState<ISpecifications>({
		title: {
			max: 300,
			min: 20,
		},
		duration: {
			max: 7200,
			min: 0,
		},
		reward: {
			max: 500,
			min: undefined,
		},
	});

	useEffect(() => {
		(async () => {
			// TODO:
			const fetchedMin: number = Number(
				e8sToIcp(await user.market.get_min_reward())
			);
			setSpecifications({
				...specifications,
				reward: { min: fetchedMin, max: specifications.reward.max },
			});
		})();
	}, []);

	// -------------- State --------------
	const initialInput: IInputs = {
		validation: {
			validTitle: false,
			validDuration: false,
			validReward: false,
		},
		title: "",
		content: "",
		duration: 0,
		reward: 0,
	};

	const inputsReducer = (state: IInputs, action): IInputs => {
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

	const [inputs, dispatch] = useReducer(inputsReducer, initialInput);
	console.log(inputs, "inputs");

	return (
		<ListWrapper>
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
				titlePlaceholder={"Add your title here"}
				inputs={inputs}
				specifications={specifications}
			/>
			{user.principal && inputs ? (
				<div className="h-[48px] flex ">
					{isValid(inputs.validation) ? (
						<Submit inputs={inputs} loggedInUser={user} />
					) : (
						<div className="heading3  self-center ml-6">
							Fill out the form correctly
						</div>
					)}
				</div>
			) : (
				<div className="heading3 ml-6"> Login to Submit</div>
			)}
		</ListWrapper>
	);
};

export default AddQuestion;
