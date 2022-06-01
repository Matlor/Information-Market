const Answer = ({ answer }: any) => {
	return (
		<div className="border  mb-5 ">
			<div className="border font-light text-xs mb-1">
				Submitted by{" "}
				<p className="no-underline hover:underline inline-block">user </p> at{" "}
				{new Date(answer.creation_date * 60 * 1000 * 1000).toLocaleString(
					undefined,
					{
						hour: "numeric",
						minute: "numeric",
						month: "short",
						day: "numeric",
					}
				)}
			</div>
			<div className="text-justify font-light"> {answer.content}</div>
		</div>
	);
};

export default Answer;
