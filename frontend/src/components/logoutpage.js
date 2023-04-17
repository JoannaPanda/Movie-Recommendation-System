import React, { Component } from "react";

class Logout extends Component {
  constructor(props) {
    super(props);

    this.handleLogout = this.handleLogout.bind(this);
    this.handleConfirmLogout = this.handleConfirmLogout.bind(this);
    this.handleCancelLogout = this.handleCancelLogout.bind(this);
  }

  handleLogout() {
    // call API to log out user using token from state
    fetch("http://lbosau.exlb.org:9900/User/Logout", {
      method: "POST",
      body: JSON.stringify({ token: this.state.token }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        // remove token and userinfo from local storage
        localStorage.removeItem("token");
        localStorage.removeItem("userinfo");

        // redirect to welcome page
        window.location.href = "/welcome";
      })
      .catch((error) => console.log(error));
  }

  handleConfirmLogout() {
    if (window.confirm("Are you sure you want to log out?")) {
      this.handleLogout();
    }
  }

  handleCancelLogout() {
    // do nothing, just close the confirmation dialog
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
      </div>
    );
  }
}

export default Logout;
