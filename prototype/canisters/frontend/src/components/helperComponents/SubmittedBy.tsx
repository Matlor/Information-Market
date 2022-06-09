import { useState } from "react";
import { graphQlToJsDate } from "../../utils/conversions";

const SubmittedBy = ({ author, creation_date }: any) => {
	const [show, setShow] = useState<any>(false);

	return (
		<div className="small-text relative">
			{show ? (
				<div className="z-1 absolute bottom-4 bg-gray-300 whitespace-nowrap ">
					{author}
				</div>
			) : (
				<></>
			)}
			Submitted by{" "}
			<p
				onMouseEnter={() => setShow(true)}
				onMouseLeave={() => setShow(false)}
				className="underline inline-block"
			>
				user{" "}
			</p>{" "}
			at{" "}
			{graphQlToJsDate(creation_date).toLocaleString(undefined, {
				hour: "numeric",
				minute: "numeric",
				month: "long",
				day: "numeric",
			})}
		</div>
	);
};

export default SubmittedBy;
