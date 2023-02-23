import React, { MouseEventHandler } from "react";
import "./SpecialButton.css";

type Props = {
  buttonText: string;
  clickEvent: MouseEventHandler;
};

const SpecialButton: React.FC<Props> = (props) => {
  return (
    <button className="special-button" onClick={props.clickEvent}>
      {props.buttonText}
    </button>
  );
};

export default SpecialButton;
