import React from "react";
import validator from "validator";
import "../review/comment.css";

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
      return (
        <div class="container">
          <div class="left-column">
            <ul>
              <li><a href="#">Detail</a></li>
              <li><a href="#">Description</a></li>
              <li><a href="#">Director</a></li>
              <li><a href="#">Cast</a></li>
              <li><a href="#">Review</a></li>
              <li><a href="#">Recommandation</a></li>
            </ul>
          </div>

          <div class="right-column">
            <div style={{justifyContent: "space-between", display: "flex"}}>
              <h4>titanic(1997)</h4>
              <a href="http://google.com">
                <img class ="buttonProfile" src={require("../images/profile.png")}></img>
              </a>
              <a href="http://google.com">
                <img class ="buttonMessage" src={require("../images/message.png")}></img>
              </a>
              <a href="http://google.com">
                <img class ="buttonMessage" src={require("../images/notice.png")}></img>
              </a>
            </div>
            <h5>Romance/Drama</h5>

            <div style={{display: "flex"}}>
              <img class ="movieImage" src={require("../images/titanic.png")}></img>
              <h2>Your Review</h2>
              <table>
                <tr>
                  <td><img class ="emptyStarImage" src={require("../images/emptyStar.png")}></img></td>
                  <td><img class ="emptyStarImage" src={require("../images/emptyStar.png")}></img></td>
                  <td><img class ="emptyStarImage" src={require("../images/emptyStar.png")}></img></td>
                  <td><img class ="emptyStarImage" src={require("../images/emptyStar.png")}></img></td>
                  <td><img class ="emptyStarImage" src={require("../images/emptyStar.png")}></img></td>
                </tr>
              </table>
              <script type="text/javascript">
                
              </script>
            </div>
            
          </div>

        </div>
      );
    }
}


export default addComment;