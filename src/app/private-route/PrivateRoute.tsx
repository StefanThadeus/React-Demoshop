import React from "react";
import { Navigate } from "react-router-dom";
import LoginService from "../../services/LoginService";

// all children components as an array property
type Props = {
  children: React.ReactElement[];
};

/**
 * component as a route which requires authentication before allowing access its children elements
 * @param props
 * @constructor
 */
const PrivateRoute: React.FC<Props> = (props) => {
  const isLoggedIn: boolean = LoginService.checkIfLoggedIn();
  if (!isLoggedIn) {
    // set current url as return point after successful log in
    localStorage.setItem("logInJumpBack", window.location.href);
  }

  // if logged in, return all children in the list, redirect to the login page if not
  return isLoggedIn ? <>{props.children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
