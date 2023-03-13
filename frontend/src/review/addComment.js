import React from "react";
import validator from "validator";

class addComment extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
        Mid: "",
        token: "",
        score: "",
        comment: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

    handleSubmit(event) {
        event.preventDefault();
        const { Mid, token, score, comment } = this.state;

        // check whether the comment is valid.
        if (comment.length >= 1000) {
            alert("Comments are limited to 1000 words or less")
        }

        if (comment.length == 0) {
            alert("Comments cannot empty")
        }

        console.log(
            "API endpoint URL:",
            "http://lbosau.exlb.org:9900/User/Comment/add"
        );

        const params = new URLSearchParams();
        params.append("Mid", Mid)
        params.append("token", token)
        params.append("score", score)
        params.append("comment", comment)

        fetch("http://lbosau.exlb.org:9900/User/Comment/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
        })
        .then((response) => {
            if (!response.ok) {
              throw new Error("Add comment Failed: " + response.status);
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
              const jsonData = JSON.parse(data);
              console.log("Add comment successful:", jsonData);
              alert("successful");
              const { commentinfo } = jsonData;
    
              // It stores the value of the "commentinfo" variable in the local storage of the user's browser
              // allows the data to persist even after the user closes the browser 
              // or navigates to a different page within the application.
              localStorage.setItem("commentinfo", commentinfo);
        
              // update state with comment infomation
              this.setState({ commentinfo });
            } 
            catch (error) {
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
      const { comment } = this.state;
  
      return (
        <form onSubmit={this.handleSubmit}>
          <textarea
            value={comment}
            onChange={(e) => this.setState({ comment: e.target.value })}
          />
          <button type="submit">Submit</button>
        </form>
      );
    }
}