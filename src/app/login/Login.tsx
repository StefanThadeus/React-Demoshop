import React from "react";
import LoginService from "../../services/LoginService";
import "./Login.css";
import SpecialButton from "../special-button/SpecialButton";
import SpecialCheckbox from "../special-checkbox/SpecialCheckbox";

const Login: React.FC = () => {
  // if user already logged in, redirect to dashboard page
  if (LoginService.checkIfLoggedIn()) {
    window.location.href = "/dashboard";
  }

  function logIn() {
    const inputUsername =
      document.querySelector<HTMLInputElement>("#username-input");
    const inputPassword =
      document.querySelector<HTMLInputElement>("#password-input");
    const inputKeepLoggedIn =
      document.querySelector<HTMLInputElement>("#keepLoggedIn");

    const username = inputUsername?.value;
    const password = inputPassword?.value;
    const keepLoggedIn = inputKeepLoggedIn?.checked;

    if (!username || !password || keepLoggedIn === undefined) {
      alert("All input fields must be filled!");
    } else {
      LoginService.loginUser(username, password, keepLoggedIn);
    }
  }

  return (
    <main className="login-page">
      <div className="login-main-container">
        <div>
          <h1>Welcome</h1>
          <h2>To DemoShop administration!</h2>
        </div>
        <div className="login-text-box-area login-label">
          Username:{" "}
          <input
            id="username-input"
            className="login-form-input-area"
            type="text"
            placeholder="Enter username"
          />
          Password:{" "}
          <input
            id="password-input"
            className="login-form-input-area"
            type="password"
            placeholder="Enter password"
          />
        </div>
        <div className="login-button-area">
          <SpecialCheckbox
            checkboxId={"keepLoggedIn"}
            label={"Keep me logged in"}
            groupName={"keepLoggedIn[]"}
          />
          <SpecialButton buttonText="Log In" clickEvent={logIn} />
        </div>
      </div>
    </main>
  );
};

export default Login;
