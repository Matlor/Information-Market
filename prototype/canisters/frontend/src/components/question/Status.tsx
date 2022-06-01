import { useState } from "react";

import Open from "./Open";
import PickAnswer from "./PickAnswer";
import Disputable from "./Disputable";
import Arbitration from "./Arbitration";
import Closed from "./Closed";

const Status = ({ questionState, plug, fetch_data, login }: any) => {
	/* 
    OPEN:
    - Answer field -> outsource
    - list of answers
    
    PICKANSWER
    - picked winner field, just visual  -> outsource
    - buttons on each answer

    DISPUTABLE
    - dispute field  -> outsource
    - visual on the answer

    ARBITRATION
    - field that work is in progress  -> outsource
    - list of answers

    PAYOUT
    - Final winner field  -> outsource
    - visual on the answer


    5 different fields

    3 different implementations for answers -> not sure if I should do it
    - list of answers
    - buttons on each answer
    - visual on the answer

    State lives in this component of what to show depending on status and login
    */

	const showFields = () => {
		switch (questionState.question.status) {
			case "OPEN":
				return (
					<>
						<Open
							questionState={questionState}
							plug={plug}
							fetch_data={fetch_data}
							login={login}
						/>
					</>
				);
			case "PICKANSWER":
				return (
					<>
						<PickAnswer
							questionState={questionState}
							plug={plug}
							fetch_data={fetch_data}
							login={login}
						/>
					</>
				);
			case "DISPUTABLE":
				return (
					<>
						<Disputable
							questionState={questionState}
							plug={plug}
							fetch_data={fetch_data}
							login={login}
						/>
					</>
				);
			case "ARBITRATION":
				return (
					<>
						<Arbitration
							questionState={questionState}
							plug={plug}
							fetch_data={fetch_data}
							login={login}
						/>
					</>
				);
			case "PAYOUT":
				return (
					<>
						{" "}
						<Closed
							questionState={questionState}
							plug={plug}
							fetch_data={fetch_data}
							login={login}
						/>
					</>
				);
			default:
				return <></>;
		}
	};

	return (
		<>
			<div> {showFields()}</div>
		</>
	);
};

export default Status;
