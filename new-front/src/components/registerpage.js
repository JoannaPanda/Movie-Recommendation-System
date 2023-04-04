import React from "react";
import validator from "validator";
import "../styles/Form.css";
const JSONbig = require("json-bigint");

class registerpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const { name, email, password } = this.state;

    if (name === "") {
      alert("invalid username.");
      return;
    }
    if (!email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)) {
      alert("invalid email address.");
      return;
    }

    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      alert("Your password is not a strong password.");
      return;
    }

    console.log(
      "API endpoint URL:",
      "http://lbosau.exlb.org:9900/User/Register"
    );

    const params = new URLSearchParams();
    params.append("name", name);
    params.append("email", email);
    params.append("password", password);

    fetch("http://lbosau.exlb.org:9900/User/Register", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Registration failed: " + response.status);
        }
        console.log("Response status code:", response.status);
        return response.text();
      })
      .then((data) => {
        console.log("Response data:", data);
        if (data.length === 0) {
          throw new Error("Empty response data");
        }
        try {
          const jsonData = JSONbig.parse(data);

          console.log("Registration successful:", jsonData);
          alert("successful");
          const { token, userinfo } = jsonData;

          // store token and user info in local storage
          localStorage.setItem("token", String(token));
          localStorage.setItem("userinfo", JSON.stringify(userinfo));
          console.log(String(token));

          // update state with token and user info
          this.setState({ token: String(token), userinfo });

          // redirect to preference setting
          window.location.href = "/setprefgenre";
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
      <div
        className="registration-page"
        style={{
          backgroundColor: "#400b0a",
          backgroundSize: `cover`,
          width: "120%",
          height: "800px",
        }}
      >
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
            <h2>Create your account</h2>
            <label htmlFor="name">Username</label>
            <input
              className="form-input"
              type="text"
              id="name"
              value={this.state.name}
              onChange={(event) => this.setState({ name: event.target.value })}
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              className="form-input"
              type="email"
              id="email"
              value={this.state.email}
              onChange={(event) => this.setState({ email: event.target.value })}
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
            <div className="pass-instruction">
              <span>&#63;</span>
            </div>
          </div>
          <button type="submit" className="form-submit">
            Sign Up
          </button>
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

export default registerpage;
