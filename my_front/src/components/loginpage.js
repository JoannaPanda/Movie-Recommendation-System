import React from "react";
import "../styles/Form.css";
import { Link } from "react-router-dom";

class loginpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const { username, password } = this.state;
    if (username === "") {
      alert("invalid username.");
    }

    fetch("http://lbosau.exlb.org:9900/User/Login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Response not ok, please try again.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Login successful:", data);
        const { token, user } = data;

        // store token and user info in local storage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // redirect to dashboard
        window.location.href = "/dashboard";
      })
      .catch((error) => {
        console.error("Login failed:", error);
        alert("Login failed.");
      });
  }

  render() {
    return (
      <div className="registration-page">
        <form
          onSubmit={this.handleSubmit}
          style={{
            height: "100%",
            position: "absolute",
            background: "black",
            color: "white",
          }}
        >
          <div>
            <h2>Hello Again!</h2>
            <label htmlFor="username">Username</label>
            <input
              className="form-input"
              type="text"
              id="username"
              value={this.state.username}
              onChange={(event) =>
                this.setState({ username: event.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              className="form-input"
              type="password"
              id="password"
              value={this.state.password}
              onChange={(event) =>
                this.setState({ password: event.target.value })
              }
            />
          </div>
          <button type="submit" className="form-submit">
            Sign In
          </button>
          <Link to="/register" className="register-link">
            Don't have an account? Register here.
          </Link>
        </form>
        {this.state.token && (
          <div>
            <p>Token: {this.state.token}</p>
            <p>User Info: {JSON.stringify(this.state.userInfo)}</p>
          </div>
        )}
        <img
          style={{
            position: "absolute",
            top: "55%",
            left: "75%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 350,
          }}
          src={require("../images/iconFull.png")}
          alt="Icon"
        />
      </div>
    );
  }
}

export default loginpage;
