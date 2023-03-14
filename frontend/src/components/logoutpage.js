import React, { Component } from "react";
import axios from "axios";

class Logout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: "",
      userinfo: {},
    };
  }

  handleLogout = () => {
    const token = this.state.token;

    axios
      .post("http://lbosau.exlb.org:9900/User/Logout", { token })
      .then((response) => {
        // remove token and userinfo from local storage
        localStorage.removeItem("token");
        localStorage.removeItem("userinfo");

        // clear state
        this.setState({ token: "", userinfo: {} });

        // redirect to login page
        this.props.history.push("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <div style={{ marginTop: "77px", color: "whitesmoke" }}>
        <h1>Logout Page</h1>
        <button onClick={this.handleLogout}>Logout</button>
      </div>
    );
  }
}

export default Logout;
