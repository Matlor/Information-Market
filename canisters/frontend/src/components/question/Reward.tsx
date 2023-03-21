import React from "react";

// TODO: change this to wherever it makes the more sense to do the conversion
import { e8sToIcp } from "../core/utils/conversions";

const Reward = ({ reward }) => {
	return (
		<div data-cy="reward">
			<div className="flex gap-2 items-center">
				<div className="text-normal-number p-3 rounded-md w-full flex gap-1 bg-[#FDFFED]">
					3.22 ICP
					{/* {Math.round(e8sToIcp(reward) * 100) / 100}{" "} */}
				</div>

				{/* <div className="text-extrasmall-number text-[#1C477D]">ICP</div> */}
			</div>
			{/* <div className="px-3 py-1 bg-colorLines rounded-sm items-center justify-center text-small">
				Reward
			</div> */}
		</div>
	);
};

export default Reward;
