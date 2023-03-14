import React from "react";
import validator from "validator";

class userReview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
  }
}
