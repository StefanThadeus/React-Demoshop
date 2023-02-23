import React from "react";
import "./ErrorPage.css";
import SpecialButton from "../special-button/SpecialButton";

const ErrorPage = () => {
  return (
    <main className="error-page">
      <div className="error-page-main-container">
        <h1>Whoops!</h1>
        <h2>Something seems to be missing...</h2>
        <h3>Error 404: The resource does not exist.</h3>
        <SpecialButton
          buttonText={"Go Back To Home Page"}
          clickEvent={() => {
            window.location.href = "/dashboard";
          }}
        />
      </div>
    </main>
  );
};

export default ErrorPage;
