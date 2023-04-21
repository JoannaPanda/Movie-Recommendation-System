import React from "react";
import validator from "validator";
import { Link } from "react-router-dom";
import "../styles/Form.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      // alert all the invalid info that entered
      toast.error("Invalid username.", {
        position: "bottom-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
      });
      return;
    }
    // alert all the invalid info that entered
    if (!email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)) {
      // alert("invalid email address.");
      toast.error("Invalid email address.", {
        position: "bottom-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
      });
      return;
    }
    // check if the password is strong enough
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      // alert("Your password is not a strong password.");
      toast.error("Your password is not a strong password.", {
        position: "bottom-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
      });
      return;
    }

    console.log(
      "API endpoint URL:",
      "http://lbosau.exlb.org:9900/User/Register"
    );
    // put all the valid information into the params
    const params = new URLSearchParams();
    params.append("name", name);
    params.append("email", email);
    params.append("password", password);
    // and post tha params to the backend
    fetch("http://lbosau.exlb.org:9900/User/Register", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })
      .then((response) => {
        // check if the regierster is ok, if there is deplicate email
        // the regerister is not ok
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
          // if nothing is wrong
          const { token, userinfo } = jsonData;

          // store token and user info in local storage
          localStorage.setItem("token", String(token));
          localStorage.setItem("userinfo", JSON.stringify(userinfo));
          console.log(String(token));

          // update state with token and user info
          this.setState({ token: String(token), userinfo });

          // redirect to preference setting
          toast.success("Registration Successful!", {
            position: "bottom-left",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            onClose: () => {
              setTimeout(() => {
                window.location.href = "/setprefgenre";
              }, 2000); // Delay redirect by 2 seconds
            },
          });
        } catch (error) {
          console.error("Registration failed:", error);
          // alert error
          toast.error("Registration failed", error, {
            position: "bottom-left",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
          });
        }
      })
      .catch((error) => {
        console.error(error);
        // alert(error);
        toast.error("Registration failed: the email has been registered", {
          position: "bottom-left",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
        });
        // if the email is already in the database
        toast.error("Please try again with a different email.", {
          position: "bottom-left",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
        });
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
          height: "900px",
        }}
      >
        {/* from here, is the form that could be used to enter the param */}
        <form
          onSubmit={this.handleSubmit}
          style={{
            height: "900px",
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
            <div className="pass-instruction1">
              <span>&#63;</span>
            </div>
          </div>
          <button type="submit" className="form-submit">
            Sign Up
          </button>
          <Link
            to="/login"
            className="login-link"
            style={{
              marginTop: "20px",
              color: "white",
            }}
          >
            Already Registered? Back to login
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
        <ToastContainer />
      </div>
    );
  }
}

export default registerpage;