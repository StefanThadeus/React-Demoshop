import React from "react";
import "./SpecialSlider.css";

type Props = {
  productId: string;
  groupName: string;
  checked?: boolean;
  eventFunctionChecked: () => void;
  eventFunctionUnchecked: () => void;
};

const SpecialSlider: React.FC<Props> = (props) => {
  const onChange = (checkboxId: string) => {
    let element = document.getElementById(checkboxId) as HTMLInputElement;
    if (element) {
      element.checked
        ? props.eventFunctionChecked()
        : props.eventFunctionUnchecked();
    }
  };

  return (
    <label className="switch-container">
      <input
        id={"checkbox-" + props.productId}
        data-product-id={props.productId}
        type="checkbox"
        name={props.groupName}
        defaultChecked={props.checked}
        onChange={() => {
          onChange("checkbox-" + props.productId);
        }}
      />
      <span className="slider"></span>
    </label>
  );
};

export default SpecialSlider;
