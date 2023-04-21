import React, { Component } from "react";

class LogoutConfirmation extends Component {
  render() {
    return (
      <div
        style={{
          position: "fixed",
          top: "0",
          left: "0",
          bottom: "0",
          right: "0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            background: "white",
            opacity: "97%",
            padding: "30px",
            borderRadius: "7px",
            boxShadow: "white",
          }}
        >
          <p style={{ fontSize: "25px", color: "black" }}>
            Are you sure you want to log out?
          </p>
          <button style={{ background: "green" }} onClick={this.props.onLogout}>
            OK
          </button>
          <button onClick={this.props.onCancel}>Cancel</button>
        </div>
      </div>
    );
  }
}

class Logout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showConfirmation: false,
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.handleConfirmLogout = this.handleConfirmLogout.bind(this);
    this.handleCancelLogout = this.handleCancelLogout.bind(this);
  }

  handleLogout() {
    const formData = new URLSearchParams();
    formData.append("token", this.state.token);

    // call API to log out user using token from state
    fetch("http://lbosau.exlb.org:9900/User/Logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        body: formData.toString(),
      },
    })
      .then((response) => {
        // if (response.ok) {
        //   alert("success");
        // }
        // remove token and userinfo from local storage
        localStorage.removeItem("token");
        localStorage.removeItem("userinfo");

        // redirect to welcome page
        window.location.href = "/welcome";
      })
      .catch((error) => console.log(error));
  }

  handleConfirmLogout() {
    this.setState({ showConfirmation: true });
  }

  handleCancelLogout() {
    this.setState({ showConfirmation: false });
  }

  componentDidMount() {
    // get token and userinfo from local storage
    const token = localStorage.getItem("token");
    const userinfoString = localStorage.getItem("userinfo");
    const userinfo = userinfoString ? JSON.parse(userinfoString) : {};

    // update state with token and userinfo
    this.setState({ token, userinfo });
  }

  render() {
    return (
      <div
        style={{
          marginTop: "77px",
          color: "whitesmoke",
          textAlign: "center",
          backgroundColor: "#400b0a",
          backgroundSize: `cover`,
          height: "900px",
          padding: "100px",
        }}
      >
        <h1>Logout</h1>
        <p>Click the button below to log out.</p>
        <button onClick={this.handleConfirmLogout}>Log out</button>
        {this.state.showConfirmation && (
          <LogoutConfirmation
            onLogout={this.handleLogout}
            onCancel={this.handleCancelLogout}
          />
        )}
      </div>
    );
  }
}

export default Logout;
