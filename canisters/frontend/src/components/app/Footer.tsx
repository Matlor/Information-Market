import React from "react";

import { IconInfinity } from "../core/Icons";

const Footer = () => {
	return (
		<div className="flex justify-between items-center p-0 self-stretch">
			<div className="flex gap-[14px] items-start">
				<div className="heading2">Powered by</div>

				<div className="self-center">
					<a href="https://internetcomputer.org/">
						<IconInfinity />
					</a>
				</div>
			</div>
		</div>
	);
};

export default Footer;
