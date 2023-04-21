import React from "react";
import validator from "validator";

// Remove Comment
class removeComment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Cid: "", // Comment ID
      token: "", // Login User Token
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const { Cid, token } = this.state;

    console.log(
      "API endpoint URL:",
      "http://lbosau.exlb.org:9900/User/Comment/remove"
    );

    const params = new URLSearchParams();
    params.append("Cid", Cid);
    params.append("token", token);

    fetch("http://lbosau.exlb.org:9900/User/Comment/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("remove comment  failed: " + response.status);
        }
        console.log("Response status code:", response.status);
        return response.text();
      })
      .catch((error) => {
        console.error(error);
        alert(error);
      });
  }

  render() {}
}
