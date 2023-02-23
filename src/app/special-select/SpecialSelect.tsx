import React from "react";
import "./SpecialSelect.css";

type Props = {
  id?: string;
  selectOptions: number[] | string[] | undefined;
  selectedValue?: number | string;
  onChangeFunction?: (e: any) => void;
  disabled?: boolean;
};

const SpecialSelect: React.FC<Props> = (props) => {
  return (
    <select
      id={props.id}
      value={props.selectedValue}
      onChange={props.onChangeFunction}
      disabled={props.disabled}
    >
      {props.selectOptions?.map((optionValue, index) => {
        // fill options list
        return (
          <option key={index} value={optionValue}>
            {optionValue}
          </option>
        );
      })}
    </select>
  );
};

export default SpecialSelect;
