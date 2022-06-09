import { default as ReactSelect, components } from "react-select";

const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};

const StatusSelection = ({ onChange, statusMap }: any) => {

  return (
    <ReactSelect
      options={[
        { value: "OPEN", label: "Open"},
        { value: "PICKANSWER", label: "Winner Selection"},
        { value: "DISPUTABLE", label: "Open for disputes"},
        { value: "DISPUTED", label: "Arbitration"},
        { value: "CLOSED", label: "Closed"}
      ]}
      isMulti={true}
      isSearchable={false}
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      components={{Option}}
      onChange={onChange}
      value={statusMap}
    />
  );
}

export default StatusSelection;