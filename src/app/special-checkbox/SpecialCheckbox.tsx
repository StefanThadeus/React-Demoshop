import React from "react";
import "./SpecialCheckbox.css";

type Props = {
  checkboxId?: string;
  label: string;
  groupName: string;
  data?: number;
  isChecked?: boolean;
  onChangeFunction?: (e: any) => void;
};

const SpecialCheckbox: React.FC<Props> = (props) => {
  return (
    <label className="checkmark-container">
      {props.label}
      <input
        id={props.checkboxId}
        type="checkbox"
        name={props.groupName}
        data-product-id={props.data}
        checked={props.isChecked}
        onChange={props.onChangeFunction}
      />
      <span className="checkmark"></span>
    </label>
  );
};

export default SpecialCheckbox;
