import Button from "../../core/view/Button";
import Loading from "../../core/view/Loading";

const Submit = ({ submit, submitStages }) => {
	const valuesPerSubmitStage = () => {
		switch (submitStages) {
			case "":
				return { style: ["empty", "empty", "empty"], text: "" };
			case "invoice":
				return {
					style: ["loading", "empty", "empty"],
					text: "Waiting for invoice",
				};
			case "transfer":
				return {
					style: ["filled", "loading", "empty"],
					text: "Transfer Ongoing",
				};
			case "submit":
				return {
					style: ["filled", "filled", "loading"],
					text: "Opening Question",
				};
			case "success":
				return {
					style: ["filled", "filled", "filled"],
					text: "Success!",
				};
			case "error":
				return {
					style: ["empty", "empty", "empty"],
					text: "Something went wrong",
				};
			default:
				return { style: ["empty", "empty", "empty"], text: "" };
		}
	};

	const SubmitStagesLoader = () => {
		return (
			<div className="flex gap-[17px]">
				<Loading
					color="colorBackgroundComponents"
					style={valuesPerSubmitStage().style[0]}
				/>
				<Loading
					color="colorBackgroundComponents"
					style={valuesPerSubmitStage().style[1]}
				/>
				<Loading
					color="colorBackgroundComponents"
					style={valuesPerSubmitStage().style[2]}
				/>
			</div>
		);
	};

	const SubmitStagesText = () => {
		return <div className="heading3 ml-4">{valuesPerSubmitStage().text}</div>;
	};

	return (
		<div className="flex items-center">
			<Button
				propFunction={submit}
				text={"Submit"}
				CustomLoader={() => {
					return <SubmitStagesLoader />;
				}}
			/>
			<SubmitStagesText />
		</div>
	);
};

export default Submit;
