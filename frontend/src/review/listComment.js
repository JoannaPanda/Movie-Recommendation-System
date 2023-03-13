import React from "react";
import validator from "validator";
import "../review/listComment.css";

class listComment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Mid: "",
            token: "",
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.handleSubmit();
    }

    handleSubmit(event) {
        const { Mid, token } = this.state;

        console.log(
            "API endpoint URL:",
            "http://lbosau.exlb.org:9900/Comment/Movie"
        );

        const params = new URLSearchParams();
        params.append("Mid", Mid)
        params.append("token", token)

        fetch("http://lbosau.exlb.org:9900/Comment/Movie", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Show comments failed: " + response.status);
          }
          return response.json();
        })
        .then((data) => {
            console.log("Response data:", data);
            if (data.length === 0) {
              throw new Error("Empty response data");
            }
            try {
              const jsonData = JSON.parse(data);
              console.log("List all comments successful:", jsonData);
              alert("successful");
              const { commentinfo, score } = jsonData;
    
              // It stores the value of the "commentinfo" variable in the local storage of the user's browser
              // allows the data to persist even after the user closes the browser 
              // or navigates to a different page within the application.
              localStorage.setItem("commentinfo", commentinfo);
        
              // update state with comment infomation
              this.setState({ commentinfo });
            } 
            catch (error) {
              console.error("Show comments failed:", error);
              alert(error);
            }
        })
        .catch((error) => {
          console.error(error);
          alert(error);
          this.setState({
            commentinfo: [
              {
                id: 1,
                text: "This is a great movie!",
                user: "user1"
              },
              {
                id: 2,
                text: "I really enjoyed the storyline.",
                user: "user2"
              },
              {
                id: 3,
                text: "The special effects were amazing!",
                user: "user3"
              },
              {
                id: 4,
                text: "I would definitely watch it again.",
                user: "user4"
              },
              {
                id: 5,
                text: "The acting was superb!",
                user: "user5"
              }
            ]
          })
        });
    }

    render() {
      const { commentinfo } = this.state;
    
      return (
        <div>
          <div className="left-column" style={{ width: "20%" }}>
            <img class="cinemaScopeSize" src="../images/iconBlack.png"></img>
            <li><a href="#">Detail</a></li>
            <h3><a href="#">Description</a></h3>
            <h3><a href="#">Director</a></h3>
            <h3><a href="#">Cast</a></h3>
            <h3><a href="#">Review</a></h3>
            <h3><a href="#">Recommandation</a></h3>
          </div>
          <div className="right-column" style={{ width: "75%" }}>
            <canvas id="graphCanvas"></canvas>
            <h3>User comments:</h3>
            <ul id="comments">
              {commentinfo && commentinfo.map((comment) => (
                <li key={comment.id}>{comment.text}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
}

export default listComment;