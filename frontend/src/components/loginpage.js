import React from "react";
import "../styles/Form.css";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JSONbig = require("json-bigint");

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idoremail: "",
      password: "",
      token: "",
      userinfo: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    const userinfo = JSON.parse(localStorage.getItem("userinfo"));
    if (token && userinfo) {
      this.setState({ token, userinfo });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const { idoremail, password } = this.state;
    if (idoremail === "") {
      // alert("invalid username.");
      toast.error("Invalid username.", {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
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
          toast.error("Login failed: " + response.status, {
            position: "bottom-left",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
          });
          throw new Error("Login failed: " + response.status);
        }
        console.log("Response status code:", response.status);
        return response.text();
      })
      .then((data) => {
        if (data.length === 0) {
          throw new Error("Empty response data");
        }
        try {
          const jsonData = JSONbig.parse(data);

          console.log("Login successful:", jsonData);
          // alert("successful");

          const { token, userinfo } = jsonData;

          // store token and user info in local storage
          localStorage.setItem("token", String(token));
          localStorage.setItem("userinfo", JSON.stringify(userinfo));
          console.log(String(token));

          // update state with token and user info
          this.setState({ token: String(token), userinfo });

          // redirect to user dashboard
          toast.success("Login Successful!", {
            position: "bottom-left",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            onClose: () => {
              setTimeout(() => {
                window.location.href = `/profile/${userinfo.Uid}`;
              }, 3000); // Delay redirect by 2 seconds
            },
          });
        } catch (error) {
          console.error("Login failed:", error);
          // alert(error);
          toast.error("Login failed:", error, {
            position: "bottom-left",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
          });
        }
      })
      .catch((error) => {
        console.error(error);
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
          <Link
            to="/register"
            className="register-link"
            style={{
              marginTop: "20px",
              color: "white",
            }}
          >
            Don't have an account? Register here
          </Link>
        </form>
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

export default LoginPage;
