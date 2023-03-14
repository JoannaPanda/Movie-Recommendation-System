import React from "react";
import "../styles/Form.css";
import { Link } from "react-router-dom";
const JSONbig = require("json-bigint");

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idoremail: "",
      password: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const { idoremail, password } = this.state;
    if (idoremail === "") {
      alert("invalid username.");
      return;
    }

    const formData = new URLSearchParams();
    formData.append("idoremail", idoremail);
    formData.append("password", password);

    fetch("http://lbosau.exlb.org:9900/User/Login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Login failed: " + response.status);
        }
        console.log("Response status code:", response.status);
        return response.text();
      })
      .then((data) => {
        alert("successful");
        if (data.length === 0) {
          throw new Error("Empty response data");
        }
        try {
          const jsonData = JSONbig.parse(data);

          console.log("Login successful:", jsonData);
          alert("successful");
          const { token, userinfo } = jsonData;

          // store token and user info in local storage
          localStorage.setItem("token", String(token));
          localStorage.setItem("user", JSON.stringify(userinfo));
          console.log(String(token));

          // update state with token and user info
          this.setState({ token: String(token), userinfo });

          // redirect to user dashboard
          window.location.href = "/dashboard";
        } catch (error) {
          console.error("Registration failed:", error);
          alert(error);
        }
      })
      .catch((error) => {
        console.error(error);
        alert(error);
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
            <label htmlFor="idoremail">Username</label>
            <input
              className="form-input"
              type="text"
              id="idoremail"
              value={this.state.idoremail}
              onChange={(event) =>
                this.setState({ idoremail: event.target.value })
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
            <p>User Info: {JSON.stringify(this.state.userinfo)}</p>
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

export default LoginPage;
