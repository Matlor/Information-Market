import { default as ReactSelect, components } from "react-select";

const Option = (props) => {
	return (
		<div>
			<components.Option {...props}>
				<input
					type="checkbox"
					className=" border-slate-800 checked:bg-slate-800"
					checked={props.isSelected}
					onChange={() => null}
				/>{" "}
				<label>{props.label}</label>
			</components.Option>
		</div>
	);
};

const StatusSelection = ({ onChange, statusMap }: any) => {
	function customTheme(theme) {
		return {
			...theme,
			colors: {
				...theme.colors,
				primary: "#FCFCFC",
			},
		};
	}

	const customStyles = {
		// Checkbox thing
		option: (provided, state) => ({
			...provided,
			color: state.isSelected ? "#5B504D" : "#5B504D",
			backgroundColor: state.isSelected ? "#E6E6E6" : "#FCFCFC",
			border: "none",
		}),

		// overall container
		container: (provided, state) => ({
			...provided,
			border: "none",
		}),

		// wraps input and the cross/arrow
		control: (provided, state) => ({
			...provided,
			minHeight: "52px",
			border: "none",
			borderRadius: "0px",
		}),

		// only the input field but without the cross and arro
		valueContainer: (provided, state) => ({
			...provided,
			margin: "0px",
			padding: "8px 0px 8px 10px",
			minHeight: "52px",
		}),
	};

	return (
		<ReactSelect
			className=""
			theme={customTheme}
			options={[
				{ value: "OPEN", label: "Open" },
				{ value: "PICKANSWER", label: "Winner Selection" },
				{ value: "DISPUTABLE", label: "Open for disputes" },
				{ value: "DISPUTED", label: "Arbitration" },
				{ value: "CLOSED", label: "Closed" },
			]}
			isMulti={true}
			isSearchable={false}
			closeMenuOnSelect={false}
			hideSelectedOptions={false}
			components={{ Option }}
			onChange={onChange}
			value={statusMap}
			styles={customStyles}
		/>
	);
};

export default StatusSelection;
