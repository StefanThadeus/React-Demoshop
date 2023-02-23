import React, { MouseEventHandler } from "react";
import "./FunctionalButton.css";

export enum ButtonColorOptions {
  Red = "functional-button-red",
  Gray = "functional-button-gray",
  Blue = "functional-button-blue",
}

type Props = {
  buttonText: string;
  clickEvent: MouseEventHandler;
  color?: ButtonColorOptions;
  minWidth?: boolean;
  constrainHeight?: boolean;
};
/**
 * Small stylized button component which can change hover color
 * @param props
 * Optional color property can be: red, blue and gray;
 * Optional minWidth property can be true or false;
 * Optional constrainHeight property can be true or false
 * @constructor
 */
const FunctionalButton: React.FC<Props> = (props) => {
  let classes = "functional-button";
  if (props.color) {
    classes += " " + props.color;
  }

  if (props?.minWidth) {
    classes += " functional-button-min-width";
  }

  if (props?.constrainHeight) {
    classes += " functional-button-constrain-height";
  }

  return (
    <button className={classes} onClick={props.clickEvent}>
      {props.buttonText}
    </button>
  );
};

export default FunctionalButton;
