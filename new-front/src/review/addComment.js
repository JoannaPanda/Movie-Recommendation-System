import "../review/comment.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

function AddComment () {
  const { mid, token } = useParams();
  console.log("mid:", mid);
  const [movie, setMovie] = useState([]);

  useEffect(() => {
      setMovie([]);

      axios
        .get(`http://lbosau.exlb.org:9900/Movie/Info?Mid=${mid}`)
        .then((response) => {
            console.log(response);
            console.log(response.data.movieinfo);
            setMovie(response.data.movieinfo);
        })
        .catch((error) => {
            console.log(error);
            window.location.href = "/404";
        });
  }, [mid]);

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
          <h4>{movie.MovieName}</h4>
          <h5>{movie.Type}</h5>
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

        <div style={{ display: "flex" }}>
          <img
            class="movieImage"
            src={`http://lbosau.exlb.org:9900/image/${movie.MovieName}/${movie.MovieName}`}
          ></img>
          <div style={{ marginTop: "-35px" }}>
            <h2>Your Review</h2>
            <div style={{ display: "flex", marginTop: "-20px" }}>
              <h4>I would like to give</h4>
              <input
                className="score-input"
                type="score"
                id="score"
                // value={this.state.score}
                // onChange={(event) =>
                //   this.setState({ score: event.target.value })
                // }
              />
              <h4>marks!!</h4>
            </div>
          </div>
        </div>
        <div style={{ marginLeft: "500px", marginTop: "-30px" }}>
          <h5>Required characters: 200</h5>
        </div>
        <input
          className="comment-input"
          type="comment"
          id="comment"
          // value={this.state.comment}
          // onChange={(event) => this.setState({ comment: event.target.value })}
        />
        <button
          className="submit-button"
          type="submit"
        >
          Submit
        </button>

      </div>
    </div>
  );
}


export default AddComment;


