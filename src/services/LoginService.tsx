import axios from "axios";

const api = axios.create({
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  baseURL: "https://demoshop-api.training.dev.logeecom.com/",
});

const LoginService = {
  checkIfLoggedIn: function () {
    return localStorage.getItem("loggedIn") === "true";
  },

  loginUser: function (
    username: string,
    password: string,
    keepLoggedIn: boolean
  ) {
    api
      .post("login", {
        username: username,
        password: password,
        keepMeLoggedIn: keepLoggedIn,
      })
      .then((res) => {
        // on successful log in, redirect to dashboard page
        if (res.status === 200) {
          localStorage.setItem("loggedIn", "true");

          if (localStorage.getItem("logInJumpBack")) {
            let jumpBackURL = localStorage.getItem("logInJumpBack") as string;
            localStorage.removeItem("logInJumpBack");
            window.location.href = jumpBackURL;
          } else {
            window.location.href = "dashboard";
          }
        }
      })
      .catch((error) => {
        if (error.response) {
          alert(
            "Error " +
              error.response.status +
              ": " +
              error.response.data["message"]
          );
        }
      });
  },

  logoutUser: function () {
    api.post("logout").then((res) => {
      // on successful log out, redirect to login page
      if (res.status === 200) {
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("logInJumpBack");
        window.location.href = "login";
      }
    });
  },
};

export default LoginService;
