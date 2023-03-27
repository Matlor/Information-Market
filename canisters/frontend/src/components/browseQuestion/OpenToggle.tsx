import React from "react";
import { ToggleButton } from "../core/Button";

const OpenToggle = ({ checks }) => {
	return (
		<div>
			<ToggleButton
				propFunction={checks.toggleStatus}
				text="Open"
				isChecked={
					!checks.status.pickanswer &&
					!checks.status.disputable &&
					!checks.status.arbitration &&
					!checks.status.payout &&
					!checks.status.closed
				}
			/>
		</div>
	);
};

export default OpenToggle;
