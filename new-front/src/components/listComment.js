import React from "react";
// import validator from "validator";
import "../styles/comment.css";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

class listComment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commentinfo: [],
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
    params.append("Mid", Mid);
    params.append("token", token);

    fetch(`http://lbosau.exlb.org:9900/Comment/Movie?Mid=${Mid}&token=${token}`)
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
          const { commentinfo, score } = data;
          console.log("List all comments successful:", data);
          alert("successful");

          // It stores the value of the "commentinfo" variable in the local storage of the user's browser
          // allows the data to persist even after the user closes the browser
          // or navigates to a different page within the application.
          localStorage.setItem("commentinfo", JSON.stringify(commentinfo));

          // update state with comment information
          this.setState({ commentinfo });
        } catch (error) {
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
              text: "This is the best romance movie I have ever watched in my life time. My tears keeps on falling down from my eyes. If you have not see this one, you must add this one to your wish list.",
              user: "Yanting",
              score: "5",
            },
            {
              id: 2,
              text: "I have watched Titanic how many times I don't know. Everytime I watch it, I still cry, laugh, smile, and feel. The story flows with tension throughout the movie; two actors' acting and chemistry need applaud; Sinking ship is realistically filmed; 'My Heart Will Go On' is perfect fit for Jack and Roses' love story and is timeless as well. All the movie's factors are fully qualified.",
              user: "Jin",
              score: "3",
            },
            {
              id: 3,
              text: "I am sorry, but I believe that this film was way over rated. It was too long , and really put myself to sleep. To really put it simple- the boat sank, get over it. :)",
              user: "Zhiyue",
              score: "4",
            },
            {
              id: 4,
              text: "This is the best romance movie I have ever watched in my life time. My tears keeps on falling down from my eyes. If you have not see this one, you must add this one to your wish list.",
              user: "Yao",
              score: "5",
            },
            {
              id: 5,
              text: "I have watched Titanic how many times I don't know. Everytime I watch it, I still cry, laugh, smile, and feel. The story flows with tension throughout the movie; two actors' acting and chemistry need applaud; Sinking ship is realistically filmed; 'My Heart Will Go On' is perfect fit for Jack and Roses' love story and is timeless as well. All the movie's factors are fully qualified.",
              user: "Yuemeng",
              score: "3",
            },
            {
              id: 6,
              text: "I am sorry, but I believe that this film was way over rated. It was too long , and really put myself to sleep. To really put it simple- the boat sank, get over it. :)",
              user: "Zhiyue",
              score: "4",
            },
          ],
        });
      });
  }

  render() {
    const { commentinfo } = this.state;

    return (
      <div class="container">
        <div class="left-column">
          <ul>
            <li>
              <a href="#">Detail</a>
            </li>
            <li>
              <a href="#">Description</a>
            </li>
            <li>
              <a href="#">Director</a>
            </li>
            <li>
              <a href="#">Cast</a>
            </li>
            <li>
              <a href="#">Review</a>
            </li>
            <li>
              <a href="#">Recommandation</a>
            </li>
          </ul>
        </div>

        <div class="right-column">
          <div style={{ justifyContent: "space-between", display: "flex" }}>
            <h4>titanic(1997)</h4>
            <a href="http://google.com">
              <img
                class="buttonProfile"
                src={require("../images/profile.png")}
              ></img>
            </a>
            <a href="http://google.com">
              <img
                class="buttonMessage"
                src={require("../images/message.png")}
              ></img>
            </a>
            <a href="http://google.com">
              <img
                class="buttonMessage"
                src={require("../images/notice.png")}
              ></img>
            </a>
          </div>
          <h5>Romance/Drama</h5>

          <div style={{ display: "flex" }}>
            <img
              class="movieImage"
              src={require("../images/titanic.png")}
            ></img>
            <h3>User Review</h3>
            <a href="http://google.com">
              <img
                class="buttonArrow"
                src={require("../images/arrow.png")}
              ></img>
              <button class="buttonWriteComment">Write a review here</button>
            </a>
          </div>

          <ul id="comments">
            {commentinfo &&
              commentinfo.map((comment) => (
                <li key={comment.id}>
                  <div className="gray-box">
                    <div className="userScore">
                      <div
                        style={{
                          display: "flex",
                          margin: "10px 0",
                          backgroundColor: "#f6f6f6",
                        }}
                      >
                        <div class="userFont">
                          {comment.user} gives {comment.score} marks!!
                        </div>
                        {Array.from({ length: comment.score }, (_, i) => (
                          <img
                            class="starImage"
                            key={i}
                            src={require("../images/star.png")}
                          />
                        ))}
                      </div>
                    </div>
                    <div class="white-box">
                      <div class="commentFont">{comment.text}</div>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default listComment;
