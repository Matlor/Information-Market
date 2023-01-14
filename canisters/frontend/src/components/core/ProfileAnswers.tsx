import React from "react";

import Profile from "./Profile";
import Answer from "./NumberOfAnswers";
import { Principal } from "@dfinity/principal";

interface IProfileAnswers {
	id: Principal;
	name: string;
	numAnswers: number;
}

const ProfileAnswers = ({ id, name, numAnswers }: IProfileAnswers) => {
	return (
		<div className="flex items-center gap-[5px] w-max">
			<Profile id={id} name={name} />
			<Answer answers={numAnswers} />
		</div>
	);
};

export default ProfileAnswers;
